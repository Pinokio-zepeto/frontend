import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DescriptionCard from '../../components/pos/DescriptionCard';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import Navbar from '../../components/pos/Navbar';
import RangeDatePicker from '../../components/pos/RangeDatePicker';
import { getSalesStatistics } from '../../apis/Sales';
import { getPosStatistics } from '../../apis/Pos';

Chart.register(...registerables);

const MainOuter = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  min-height: 100vh;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
`;

const DateNavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RedText = styled.span`
  color: #ec7348;
`;

const Button = styled.button`
  background-color: ${(props) =>
    props.startDate.getDate() === props.configStartDate &&
    props.endDate.getDate() === props.configEndDate
      ? '#d9d9d9'
      : 'rgb(255, 255, 255, 0)'};
  color: black;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1rem;
`;

const StatisticsResult = styled.div`
  display: flex;
  flex-direction: row;
`;

const MainBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Descriptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  border: solid 1px black;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Charts = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

function SalesReportPage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  // const [graphUnit, setGraphUnit] = useState('day');

  // const [statisticsData, setStatisticsData] = useState(null);

  const [posStatisticsData, setPosStatisticsData] = useState({
    // 포스 30일 동안의 매출, 총 포스 수, 등수
    averageSales: null,
    posCount: null,
    currentPosRank: null,
  });

  const [salesTotal, setSalesTotal] = useState(0);

  const [showedData, setShowedData] = useState({
    labels: ['8월'],
    datasets: [
      {
        label: '매출',
        backgroundColor: 'rgba(115, 146, 255, 0.2)',
        borderColor: 'rgba(115, 146, 255, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(115, 146, 255, 0.4)',
        hoverBorderColor: 'rgba(115, 146, 255, 1)',
        data: [1],
      },
    ],
  });
  const [statisticsData, setStatisticsData] = useState(null);
  const [options, setOptions] = useState({
    scales: {
      x: {
        type: 'category',
        labels: ['8월'],
      },
    },
  });

  const makeDateFormat = (date) => {
    // 어떤 날짜여도 'YYYY-DD-YY'형식으로 변환!
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const dateStr = `${year}-${month}-${day}`;
    return dateStr;
  };

  useEffect(() => {
    getPosStatisticsThirty();
  }, [posStatisticsData]);

  const getPosStatisticsThirty = async () => {
    let posStatistics = await getPosStatistics();
    setPosStatisticsData(posStatistics);
  };

  useEffect(() => {
    getStatisticsData();
    console.log('before start date : ', makeDateFormat(getPreviousMonthDate(startDate)));
    console.log('before end date : ', makeDateFormat(getPreviousMonthDate(endDate)));
  }, [dateRange]);

  const changePriceForm = (price) => {
    return '₩' + price.toLocaleString();
  };

  const getStatisticsData = async () => {
    const data = await getSalesStatistics(makeDateFormat(startDate), makeDateFormat(endDate));
    setStatisticsData(data);
    console.log('get statistics data : ', data);
    if (!data || !data.dailySales) {
      console.log('data or data.dailySales is null or undefined');
      return;
    }
    data.dailySales.sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
    console.log('dailySales is sorted');
    let sum = 0;
    let labelsTemp = [];
    let dataTemp = [];
    console.log('dailySales', data.dailySales);
    for (const dailytotal of data.dailySales) {
      console.log(dailytotal);
      sum += dailytotal['totalSales'];
      labelsTemp.push(dailytotal['startDate']);
      dataTemp.push(dailytotal['totalSales']);
    }

    console.log('labelsTemp : ', labelsTemp);
    console.log('dataTemp : ', dataTemp);

    setShowedData({
      labels: labelsTemp,
      datasets: [
        {
          label: '매출',
          backgroundColor: 'rgba(115, 146, 255, 0.2)',
          borderColor: 'rgba(115, 146, 255, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(115, 146, 255, 0.4)',
          hoverBorderColor: 'rgba(115, 146, 255, 1)',
          data: dataTemp,
        },
      ],
    });
    setOptions({
      scales: {
        x: {
          type: 'category',
          labels: labelsTemp,
        },
      },
    });
    setSalesTotal(sum);
  };

  useEffect(() => {
    console.log('showedData : ', showedData);
  }, [showedData]);

  useEffect(() => {
    console.log('options : ', options);
  }, [options]);

  useEffect(() => {
    console.log('options : ', salesTotal);
  }, [salesTotal]);

  const getPreviousMonthDate = (date) => {
    // 현재 날짜에서 한 달을 뺀 날짜를 생성
    let previousMonthDate = new Date(date);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

    // 현재 일(day)이 계산된 월의 마지막 날짜를 초과하는지 확인
    if (date.getDate() > getLastDayOfMonth(previousMonthDate)) {
      // 초과한다면 그 차이를 일(day)로 설정
      previousMonthDate.setDate(date.getDate() - getLastDayOfMonth(previousMonthDate));
    } else {
      // 그렇지 않다면, 동일한 일(day)을 설정
      previousMonthDate.setDate(date.getDate());
    }

    return previousMonthDate;
  };

  function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  const getBeforeStatisticsData = async () => {
    const data = await getSalesStatistics(
      makeDateFormat(getPreviousMonthDate(startDate)),
      makeDateFormat(getPreviousMonthDate(endDate))
    );
  };

  useEffect(() => {
    let noticeMessageTemp = '지난 달 같은 기간 대비';
  }, [salesTotal]);
  // useEffect(() => {}, [startDate]);
  // useEffect(() => {}, [endDate]);

  const getChartLabel = () => {};

  const handleTodayClick = () => {
    const today = new Date();
    setDateRange([today, today]);
  };

  const handleYesterdayClick = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDateRange([yesterday, yesterday]);
  };

  const handleThisWeekClick = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
    // const lastDayOfWeek = new Date(today);
    // lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    setDateRange([firstDayOfWeek, today]);
  };

  const handleThisMonthClick = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDateRange([firstDayOfMonth, today]);
  };

  const formatDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '';
  };

  const handleTest = () => {
    console.log('start - date');
    console.log(startDate.getDate());
    console.log('end - date');
    console.log(endDate.getDate());
    console.log('boolean');
    console.log(startDate === endDate);
    console.log(new Date().getDate() - 1);
  };

  return (
    <MainOuter>
      <Navbar isOpen={isNavbarOpen} toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)} />
      <Main>
        <Header onClick={handleTest}>매출 리포트</Header>
        <DateNavBar>
          <Buttons>
            <Button
              onClick={handleYesterdayClick}
              startDate={startDate}
              endDate={endDate}
              configStartDate={new Date().getDate() - 1}
              configEndDate={new Date().getDate() - 1}
            >
              어제
            </Button>
            <Button
              onClick={handleTodayClick}
              startDate={startDate}
              endDate={endDate}
              configStartDate={new Date().getDate()}
              configEndDate={new Date().getDate()}
            >
              오늘
            </Button>
            <Button
              onClick={handleThisWeekClick}
              startDate={startDate}
              endDate={endDate}
              configStartDate={new Date().getDate() - new Date().getDay() + 1}
              configEndDate={new Date().getDate()}
            >
              이번주
            </Button>
            <Button
              onClick={handleThisMonthClick}
              startDate={startDate}
              endDate={endDate}
              configStartDate={new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).getDate()}
              configEndDate={new Date().getDate()}
            >
              이번달
            </Button>
          </Buttons>
          <RangeDatePicker setDateRange={setDateRange} dateRange={dateRange} />
        </DateNavBar>
        <MainBody>
          <StatisticsResult>
            최근 30일 동안의 매출은
            <RedText>{changePriceForm(posStatisticsData.averageSales || '')}</RedText>이고, 전국
            &nbsp;
            <RedText>{posStatisticsData.posCount}</RedText>개의 포스 중&nbsp;
            <RedText>{posStatisticsData.currentPosRank}</RedText>
            등입니다.
          </StatisticsResult>
          <Charts>
            <Bar data={showedData} options={options} />
          </Charts>
        </MainBody>
      </Main>
    </MainOuter>
  );
}

export default SalesReportPage;
