import React, { FC, useState} from 'react';
import {
  Card,
  Layout,
  Row,
  Col,
  Select,
  Empty,
  Divider,
  AutoComplete,
  Form,
  Button,
  Modal,
  Spin,
  Space,
  Descriptions
} from 'antd';
import axios from 'axios';
import Data from './hospitalList.json'

const { Content } = Layout;
const { Option } = Select;

const layout = {
  labelCol: { span: 6},
  wrapperCol: {span: 4},
}

const tailLayout = {
  wrapperCol: {offset:4, span: 8}
}

const searchResult = (query: string) => {
  const d = Data.name.filter(value => value.match(query))
  return d.map(op => ({value: op}))
}

const App: FC = () => {
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState(
    {
      isLoading: true,
      hasError: false,
      photos: "",
      formatted_address: "",
      name: "",
      rating: ""
    } as any
  )
  const [options, setOptions] = useState([] as any);
  const [form] = Form.useForm();

  const handleOk = (e: any) => {
    console.log(e);
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  const onReset = () => {
    form.resetFields();
  }
  
  const onFinish = (values: any) => {
    const {input, radius} = values
    console.log(values.input)
    const fetchData  = async () => {
      const response = await axios(
        `https://zurius-api.herokuapp.com/?input=${input}&radius=${radius}`
      )
      const {Error, Message} = response.data
      console.log(response.data)
      if (Error) {
        setState({
          ...state, ...{
            isLoading:false,
            hasError: true,
            Error,
            Message
          } 
        })
        return
      }
      const {Candidates} = Message;
      setState({
        ...state, ...{
          isLoading:false,
          ...Candidates[0]
        } 
      })
    }
    console.log(state)
    fetchData()
    showModal()
  };

  const handleChange = (value: string) => {
    form.setFieldsValue({radius: parseInt(value) || " "});
  }
  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value): []);
  };
  const onSelect = (value: string) => {
    form.setFieldsValue({input: value+ " Nigeria" });
  };

  const radiusList = [
    '5km', '10km', '20km'
  ]
  return (
  <div className="App">
    <Layout>
      <Content>
        <Row gutter={16} justify="center" align="middle">
          <Col span={10}>
            <Card
              hoverable
              style={{ margin: '1rem'}}
              cover={
                <img
                  alt="example"
                  src="https://res.cloudinary.com/oluwatobiloba/image/upload/v1591795521/incredible%20project/hero-image_ixmtkr.png"
                />
              }
            />
          </Col>
          <Col span={12}>
          <Divider orientation="center" style={{ color: '#333', fontWeight: 'normal' }}>
            Search Hospitals
          </Divider>
            <Form {...layout} form={form} name= "control-hooks" onFinish={onFinish}>
              <Form.Item name="input" label="Search" rules={[{required: true}]}>
              <AutoComplete
                dropdownMatchSelectWidth={252}
                style={{
                  width: 300,
                }}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
                placeholder="search text"
              />
              </Form.Item>

              <Form.Item name="radius" label="Radius">
              <Select style={{ width: 120 }} onChange={handleChange} allowClear >
              {radiusList.map((e) => (
                <Option value={e} key={e}>{e}</Option>
              ))}
            </Select>
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Empty  description={
              <span>
                No Search Result
              </span>
            }
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            />
          </Col>
        </Row>
        <Modal
          title="Search Results"
          visible={visible}
          onOk={handleOk}
          onCancel={handleOk}
        >
          {state.isLoading? (
            <Space size="middle">
              <Spin size="large"/>
            </Space>
          ): [( state.hasError ?
            <Descriptions title="Error">
              <Descriptions.Item label="Error type">{state.Error}</Descriptions.Item>
              <Descriptions.Item label="Error message">{state.Message}</Descriptions.Item>
            </Descriptions>
            : 
            <Descriptions>
              <Descriptions.Item label="Hopital Name">{state.name}</Descriptions.Item>
              <Descriptions.Item label="Rating">{state.rating}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {state.formatted_address}
              </Descriptions.Item>
            </Descriptions>
            )]}
        </Modal>
      </Content>
    </Layout>
  </div>
  )
};

export default App;
