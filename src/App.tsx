import React, { FC, useState, useEffect} from 'react';
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
  Button
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
  const [query, setQuery] = useState({} as any)
  const [state, setState] = useState(
    {
      isLoading: true,
      photos: "",
      formatted_address: "",
      name: "",
      rating: ""
    }
  )
  const [options, setOptions] = useState([] as any);
  const [form] = Form.useForm();
  useEffect(() => {
    const fetchData  = async () => {
      const result = await axios(
        `http://localhost:8080/?input=${query.input}&radius=${query.radius}`
      )
      const {Candidates} = result.data.Message;
      setState({
        ...state, ...{
          isLoading:false,
          ...Candidates[0]
        } 
      })
    }
    fetchData()
  }, [query])
  const onReset = () => {
    form.resetFields();
  }
  const onFinish = (values: object) => {
    setQuery({...values})
    
  };

  const handleChange = (value: string) => {
    form.setFieldsValue({radius: value || " "});
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
      </Content>
    </Layout>
  </div>
  )
};

export default App;
