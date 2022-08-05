import React, { useRef } from "react";
import logo from "@images/logo/logo_text_green.svg";
import kakao from "@images/icon/kakao.svg";
import naver from "@images/icon/naver.svg";
import google from "@images/icon/google.svg";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmail, setUserInfo } from '../../store/user';
import { login, getUserInfo } from "../../apis/user"; // login api
// import { setEmail } from '../../store/user';
// import { login } from "../../apis/user"; // login api

function Login() {
  const kauthUrl='https://kauth.kakao.com/oauth/authorize?client_id=ecf0cdf8c6d0f9625b2d33d19a397c94&redirect_uri=http://localhost:3000/kakao&response_type=code';
  const nauthUrl='https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=fZskdl4WGlcbiRs_kN0o&state=nvYVNJlSXj&redirect_uri=http://localhost:3000/naver';
  const gauthUrl='https://accounts.google.com/o/oauth2/v2/auth?client_id=20844847177-q0d7adnlu1gf7kbjis3boe6olme5c8pv.apps.googleusercontent.com&redirect_uri=http://localhost:3000/google&response_type=code&scope=profile';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionStorage } = window;
  // const wait = (sec) => {
  //   const start = Date.now()
  //   let now = start;
  //   while (now - start < sec * 1000) {
  //       now = Date.now();
  //   }
  // };
  const emailRef = useRef();
  const passRef = useRef();
  const canLogin = async () => {
      const userEmail = emailRef.current.value;
      const res = await login({
        email: userEmail,
        password: passRef.current.value
      });
      // 리덕스 스토어에 이메일 저장
      dispatch(setEmail({email: userEmail}))
      // 세션스토리지에 토큰 저장
      sessionStorage.setItem("refreshToken", res.refreshToken);
      sessionStorage.setItem("accessToken", res.Authorization);
      // 유저 정보 가져오기
        // console.log("유저 정보 가져오기")
        const userRes = await getUserInfo(userEmail);
        // console.log(userRes.userInfo);
        // 유저 정보 스토어에 저장
        dispatch(setUserInfo(userRes.userInfo))
      navigate("/");

    
    };

  return (
    <div className="container flex">
      <div id="login" className="login flex justify-center">
        <div className="login_title">
          <img src={logo} alt="logoImage" className="login_title_logo" />
        </div>
        <div className="login_input flex align-center justify-center">
          <input
            ref={emailRef}
            className="login_input_ID notoReg fs-16"
            type="email"
            placeholder="이메일"
          />
          <form>
            <input
              ref={passRef}
              className="login_input_PW notoReg fs-16"
              type="password"
              placeholder="비밀번호"
            />
          </form>
        </div>
        <div className="login_btn flex align-center justify-center">
          <button className="fs-18 notoBold" type="button" onClick={canLogin}>
            로그인
          </button>
        </div>

        <div className="login_text notoReg fs-14 flex justify-space-between">
          <Link to="/findid">ID 찾기</Link>
          <Link to="/join">회원가입</Link>
        </div>
        <div className="divide" />
        <div className="login_social_txt notoMid fs-12 flex align-center justify-center">
          SNS계정으로 간편 로그인
        </div>
        <div className="login_social_icons flex">
          <button className="login_social_icon_kakao" type="button">
          <a href={kauthUrl}>
            <img src={kakao} alt='kakao'/>
           </a>
          </button>
          <button className="login_social_icon_naver" type="button">
            <a href={nauthUrl}>
              <img src={naver} alt="naver" />
            </a>
          </button>
          <a href={gauthUrl}>
            <button className="login_social_icon_google" type="button">
              <img src={google} alt="google" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
export default Login;