import { useState, useContext, useEffect } from "react";
import { RiLock2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { Button, Form, Input, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Logo from "../../images/ULogo.png";
import { AppContext } from "../../store/AppContext";
import { login, forgotPassword, resetPassword, resendVerificationCode } from "../../Services";

import "./login.scss";

const Login = () => {
  const { setLoggedIn, setUserDetails, setCategories } = useContext(AppContext);
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isInvalid, setInvalid] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isForgotInitiated, setForgotInitiated] = useState(false);

  useEffect(() => {
    setLoggedIn(false);
    setUserDetails(null);
    setCategories([]);
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault();
    let response = await login(email, password);
    if (response.success) {
      setLoggedIn(true);
      navigate('/home');
    }
  };

  const onChange = (value, updatedField) => {
    updatedField(value);
  };

  const isDisabled = () => {
    // TODO - Need to work on password rules.
    if (email.trim() === "" || password === "") {
      return true;
    }
    return false;
  };

  const forgotHandler = async() => {
    if (!isForgotInitiated) {
      let response = await forgotPassword(email);
      if (response.success) {
        setForgotInitiated(true);
      }
    } else {
      let response = await resetPassword(code, password, passwordConfirm, email);
      if (response.success) {
        cancelHandler();
      }
    }
  };

  const onResend = async() => {
    let response = await forgotPassword(email);
  }

  const cancelHandler = () => {
    setEmail('');
    setPassword('');
    setIsForgot(false);
    setPasswordConfirm('');
    setForgotInitiated(false);
  };

  const renderForgotModal = () => {
    return <Modal isOpen={true} className="forgot-password-modal">
      <ModalHeader>
        <div className="custom-title">
          <RiLock2Fill/>
          Forgot your password ?
          <div className="message">No worries! Enter your email and we will send you a Verification code.</div>
        </div>
      </ModalHeader>
    <ModalBody>
        <Input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            invalid={isInvalid}
            disabled={isForgotInitiated}
            plaintext={false}
            onChange={(e) => onChange(e.target.value, setEmail)}
          />
      { isForgotInitiated && <>
        <div className="reset">Reset Password</div>
        <Input
              type="text"
              name="code"
              id="code"
              className="verification-code"
              onChange={(e) => onChange(e.target.value, setCode)}
              placeholder="Verification Code" />
        <div
          className="resend-code"
          onClick={() => resendVerificationCode(email)}
        >
          Resend Verification Code
        </div>
        <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            invalid={isInvalid}
            onChange={(e) => onChange(e.target.value, setPassword)}
          />
          <Input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            value={passwordConfirm}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value, setPasswordConfirm)}
            placeholder="Confirm password"
          />
      </>
      }
    </ModalBody>
    <ModalFooter>
    <Button color="secondary" onClick={cancelHandler}>
        Cancel
      </Button>
      <Button color="primary" onClick={forgotHandler}>
        Confirm
      </Button>
    </ModalFooter>
  </Modal>
  };

  return (
    <>
      <div className="back-home" onClick={() => navigate('/')}>
        <IoReturnDownBackOutline/>
        <div className="title">Back to Home</div>
      </div>
      <div className="auth-container">
        <div className="logo"><img src={Logo}/></div>
        <div className="login">
          <h3>Sign In</h3>
          { isForgot && renderForgotModal()}
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              invalid={isInvalid}
              plaintext={false}
              onChange={(e) => onChange(e.target.value, setEmail)}
            />
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              invalid={isInvalid}
              onChange={(e) => onChange(e.target.value, setPassword)}
            />
            <div className="forgot" onClick={() => setIsForgot(true)}>Forgot Password?</div>
            <div className="policy">
              By continuing, you agree to QKIRA conditions of Use and Privacy
              Notice. {/* TODO - Need information */}
            </div>
            <div className="help">Need Help?</div> {/* TODO - Need information */}
            <FormFeedback tooltip>
              The email or password entered is invalid. Please try again.
            </FormFeedback>
            <Button disabled={isDisabled()}>Continue</Button>
          </Form>
        </div>
        <div className="register">
          New to QKIRA
          <Button onClick={() => navigate('/signup')}>
            Create your QKIRA Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
