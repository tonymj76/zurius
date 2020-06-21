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
  Badge,
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
      results:[],
      name:""
    } as any
  )
  const [options, setOptions] = useState([] as any);
  const [form] = Form.useForm();

  const handleOk = (e: any) => {
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
    const url = radius ? `https://api.tomtom.com/search/2/search/${input}.json?key=${process.env.REACT_APP_APIKEY}&countrySet=NG&lat=37.8085&lon=-122.423&radius=${radius}` : `https://api.tomtom.com/search/2/search/${input}.json?key=${process.env.REACT_APP_APIKEY}&countrySet=NG&lat=37.8085&lon=-122.423`
    // const url = radius ? `https://zurius-api.herokuapp.com/?input=${input}&radius=${radius}` : `https://zurius-api.herokuapp.com/?input=${input}`
    // const url = radius ? `http://localhost:8080/?input=${input}&radius=${radius}` : `http://localhost:8080/?input=${input}`
    const fetchData  = async () => {
      await axios.get(
        url
      ).then(
        (response: any) => {
          const {results, summary} = response.data;
          setState({
            ...state, ...{
              isLoading:false,
              results: results,
              name: summary.query
            } 
          })
        }
      ).catch((error: any) => {
        setState({
          ...state, ...{
            isLoading:false,
            hasError: true,
          } 
        })
      })
    }
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
    form.setFieldsValue({input: value});
  };

  const radiusList = [
    '5km', '10km', '20km', '50km', '100km', '1000km', '2000km'
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
              <Descriptions.Item label="Error type">maps: REQUEST_DENIED - You must enable Billing on the Google Cloud Project at 
              https://console.cloud.google.com/project/_/billing/enable 
              Learn more at </Descriptions.Item>
              <Descriptions.Item label="Error message">failed to fetch request</Descriptions.Item>
            </Descriptions>
            : 
            <Descriptions>
              {state.results.map(((data: any) => (
              <>
                <Descriptions.Item label="Hopital Name" key={data.id}>{state.name}</Descriptions.Item>
                <Descriptions.Item label="Score">{data.score}</Descriptions.Item>
                <Descriptions.Item label="Categories">
                  {data.poi.categories[0] || ""}<br/> {data.poi.categories[1] || " "}
                </Descriptions.Item>
                <Descriptions.Item label="Position" span={3}>
                  <Badge status="processing" text="Position" />
                </Descriptions.Item>
                <Descriptions.Item label="Latitude">{data.position.lat}</Descriptions.Item>
                <Descriptions.Item label="Longitude">{data.position.lon}</Descriptions.Item>
                <Descriptions.Item label="Status" span={3}>
                  <Badge status="processing" text="Address" />
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {data.address.country}
                </Descriptions.Item>
                <Descriptions.Item label="Country Subdivision">
                  {data.address.countrySubdivision}
                </Descriptions.Item>
                <Descriptions.Item label="Free-form Address">
                  {data.address.freeformAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Municipality">
                  {data.address.municipality}
                </Descriptions.Item>
                <Descriptions.Item label="Municipality Subdivision">
                  {data.address.municipalitySubdivision}
                </Descriptions.Item>
                <Descriptions.Item label="Street Name">
                  {data.address.streetName}
                </Descriptions.Item>
                <Descriptions.Item label="Classifications" span={3}>
                  <Badge status="processing" text="Classifications" />
                </Descriptions.Item>
                <Descriptions.Item label="Names">
                  {data.poi.classifications[0].names[0].name}
                </Descriptions.Item>
                <Descriptions.Item label="Name Locale">
                  {data.poi.classifications[0].names[0].nameLocale}
                </Descriptions.Item>
              </>
              )))}
            </Descriptions>
            )]}
        </Modal>
      </Content>
    </Layout>
  </div>
  )
};

export default App;
