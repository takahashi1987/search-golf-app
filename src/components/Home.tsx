import React, {Key} from 'react';
import './Common.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';

import axios from 'axios';

import Result from './Result';
import Loading from './Loading';


import format from 'date-fns/format';

// Plan型を定義する。export して Result コンポーネントでも import できるようにする
export type Plan = {
  plan_id: Key;
  image_url: string;
  course_name: string;
  duration: string;
  price: string;
  evaluation: string;
  prefecture: string;
  plan_name: string;
  caption: string;
  reserve_url_pc: string;
}

const Home = () => {
  const Today = new Date()
  // setDateで渡す引数の型をDate型だと明示的に書く。
  const [date, setDate] = React.useState<Date>(Today);

  // budget Stateの初期値は 8000。setBudgetで渡す引数の型をnumber型だと明示的に書く。
  const [budget, setBudget] = React.useState<number>(8000);

  // departure Stateの初期値は1。setDepartureで渡す引数の型をnumber型だと明示的に書く。
  const [departure, setDeparture] = React.useState<number>(1);

  // duration Stateの初期値は60。setDurationで渡す引数の型をnumber型だと明示的に書く。
  const [duration, setDuration] = React.useState<number>(60);

  // setPlans で渡す引数の型はPlan型の配列だと明示的に書く。
  const [plans, setPlans] = React.useState<Plan[]>([]);

  const [plansCount, setPlansCount] = React.useState<number | undefined>(undefined);

  const [hasError, setHasError] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);

  registerLocale('ja', ja);

  const onFormSubmit = async (event: { preventDefault: () => void; }) => {
    try {
      // <form>タグを使うと、ボタンを押した際にデフォルトでonSubmitイベントが走ります。今回は、onSubmitイベントが走ったら、自分で作ったonFormSubmit関数を実行したいため、こちらの記述でデフォルトのsubmit処理をキャンセルしています。参考：https://developer.mozilla.org/ja/docs/Web/API/Event/preventDefault
      event.preventDefault();

      setLoading(true);

      // 02.APIのモックを作ろうで作成したAPIを貼り付けます。axiosを使って、getのHTTP通信を行います。今は、パラメータは適当な値を入れています。
      const response = await axios.get('https://6ruhv4yal6.execute-api.ap-northeast-1.amazonaws.com/production/golf-courses', {
        params: {
          date: format(date, 'yyyyMMdd'),
          budget: budget,
          departure: departure,
          duration: duration
        }
      });

      setPlans(response.data.plans);
      setPlansCount(response.data.plansCount);
      console.log(date, budget, departure, duration)
      console.log(response)

      setLoading(false);
    } catch (e) {
      console.log(e)
      setHasError(true)
    }
  }

  return (
    <div className="ui container" id="container">
      <div className="Search__Form">
        <form className="ui form segment" onSubmit={onFormSubmit}>
          <div className="field">
            <label><i className="calendar alternate outline icon"></i>プレー日</label>
            <DatePicker
              locale='ja'
              dateFormat='yyyy/MM/dd'
              selected={date}
              minDate={Today}
              onChange={selectedDate => {setDate(selectedDate || Today)}}
            />
          </div>
          <div className="field">
            <label><i className="yen sign icon"></i>上限金額</label>
            <select
              className="ui dropdown"
              name="dropdown"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            >
              <option value="8000">8,000円</option>
              <option value="12000">12,000円</option>
              <option value="16000">16,000円</option>
            </select>
          </div>
          <div className="field">
            <label><i className="map pin icon"></i>移動時間計算の出発地点（自宅から近い地点をお選びください）</label>
            <select
              className="ui dropdown"
              name="dropdown"
              value={departure}
              onChange={(e) => setDeparture(Number(e.target.value))}
            >
              <option value="1">東京駅</option>
              <option value="2">横浜駅</option>
            </select>
          </div>
          <div className="field">
            <label><i className="car icon"></i>車での移動時間の上限</label>
            <select
              className="ui dropdown"
              name="dropdown"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              <option value="60">60分</option>
              <option value="90">90分</option>
              <option value="120">120分</option>
            </select>
          </div>
          <div className="Search__Button">
            <button type="submit" className="Search__Button__Design">
              <i className="search icon"></i>ゴルフ場を検索する
            </button>
          </div>
        </form>
        <Loading loading={loading}/>
        <Result plans={plans} plansCount={plansCount} error={hasError}/>
      </div>
    </div>
  )
}

export default Home;
