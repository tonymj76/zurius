import React, { FC, useState} from 'react';
import { Card,Layout, Row, Col,Select, Empty, Input, AutoComplete} from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import Data from './hospitalList.json'

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#31aa52',
    }}
  />
);

const searchResult = (query: string) => {
  const d = Data.name.filter(value => value.match(query))
  return d.map(op => ({value: op}))
}

const App: FC = () => {
  const [options, setOptions] = useState([] as any);

  const handleChange = (value: string) => {
    return console.log(value);
  }
  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value): []);
  };
  const onSelect = (value: string) => {
    console.log(`${value} Nigeria`);
  };

  const radusList = [
    '5km', '10km', '20km'
  ]
  return (
  <div className="App">
    <Layout>
      <Header>
        <h1 className="display-3">Header</h1>
      </Header>
      <Content>
        <Row gutter={16}>
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
            
            <AutoComplete
              dropdownMatchSelectWidth={252}
              style={{
                width: 300,
              }}
              options={options}
              onSelect={onSelect}
              onSearch={handleSearch}
            >
              <Search
                placeholder="search text"
                enterButton="Search"
                size="large"
                suffix={suffix}
              />
            </AutoComplete>
            <span>Radius</span>
            <Select style={{ width: 120 }} onChange={handleChange} allowClear >
              {radusList.map((e) => (
                <Option value={e} key={e}>{e}</Option>
              ))}
            </Select>
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
      <Footer>Footer</Footer>
    </Layout>
  </div>
  )
};

export default App;
