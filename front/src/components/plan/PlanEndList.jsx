import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import PlanCard from "@components/plan/PlanCard";
import { getEndPlan } from "../../apis/plan";

function PlanEndList() {
  const userId = useSelector(state => state.user.email);
  console.log(userId);
  //   const past = true;
  const [list, setList] = useState([]); // 리스트 불러오기
  const now = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]; // 현재시간
  useEffect(() => {
    async function getList() {
      const res = await getEndPlan(userId, now);
      setList(res);
      console.log(res);
    }

    getList();
  }, []);
  return (
    <div className="flex column">
      <div className="plan_past_title notoBold fs-28">
        지난 캠핑 어떠셨나요?
      </div>
      <div className="flex">
        {list.length !== 0 &&
          list.map(
            ({
              savedTitle,
              // place,
              startDate,
              endDate,
              campId,
              saveId,
              firstImageUrl
            }) => (
              <PlanCard
                className="past_img"
                key={v4()}
                savedTitle={savedTitle}
                // place={place}
                startDate={startDate.substr(0, 10)} // 문자열 자르기
                endDate={endDate.substr(0, 10)} // 문자열 자르기
                campId={campId}
                saveId={saveId}
                firstImageUrl={firstImageUrl}
              />
            )
          )}
        {list.length === 0 && (
          <div className="none_endPlan flex column align-center">
            <div className="none_endPlan_txt notoMid fs-22 ">
              지난 캠핑이 없습니다 ㅠㅅㅠ
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlanEndList;
