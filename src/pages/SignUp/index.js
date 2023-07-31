import { useState } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Spinner } from "reactstrap";

import Logo from "../../images/ULogo.png";
import { signUp, activateAccount, resendVerificationCode } from "../../Services";

import './signup.scss';

const SignUp = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [referrerCode, setReferrerCode] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [hasReferrerCode, setHasReferrerCode] = useState(false);

  const onChange = (value, updatedField) => {
    updatedField(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);

    let response = await signUp(email, password, passwordConfirm, fname, lname, referrerCode);
    if (response.error) {
      toast.error(response.message);
      setIsDisabled(false);
      setLoading(false);
    } else if (response.success) {
      setIsDisabled(true);
      setLoading(false);
      toast.success(response.message);
    }
  };

  const handleActivate = async() => {
    let response = await activateAccount(email, code);
    if (response.error) {
      toast.error(response.message);
    } else if (response.success) {
      navigate('/');
      toast.success(response.message);
    }
  };

  const isRegisterDisabled = () => {
    return (fname === "" || lname === "" || email === "" || password === "" || passwordConfirm === "") 
  }

  return (
    <div className="auth-container">
      <div className="logo">
        <img src={Logo}/>
      </div>
      <div className='signup'>
        <h3>Create an Account</h3>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstname"
            id="firstname"
            value={fname}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value, setFname)}
            placeholder="Your First Name"
          />
          <Input
            type="text"
            name="lastname"
            id="lastname"
            value={lname}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value, setLname)}
            placeholder="Your Last Name"
          />
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value, setEmail)}
            placeholder="Email"
          />
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            disabled={isDisabled}
            onChange={(e) => onChange(e.target.value, setPassword)}
            placeholder="Password"
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
          <Input
            type="checkbox"
            className="inline"
            required
            disabled={isDisabled}
          ></Input>
          <label className="inline">I agree all Terms and conditions</label>
          <br/>
          <Input
            type="checkbox"
            className="inline"
            onClick={() => setHasReferrerCode(!hasReferrerCode)}>
            </Input>
          <label className="inline">Has Referrer Code</label>
          {
            hasReferrerCode && <Input
            type="text"
            name="referrerCode"
            id="referrerCode"
            onChange={(e) => { console.log("ME >>", e.target.value); onChange(e.target.value, setReferrerCode)}}
            placeholder="Referrer Code" />
          }
          {
            isDisabled && !isLoading && <><Input
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
              <Button disabled={code === ""} onClick={handleActivate}>VERIY ACCOUNT</Button></>
          }
          {
            !isDisabled && !isLoading && <Button disabled={isRegisterDisabled()}>Register</Button>
          }
          {
            isLoading && <div className="loader">
              <Spinner className="m-5" color="primary" />
            </div>
          }
        </Form>
        <div className="already">
          Have already a account ? <Link to='/login'>Login here</Link>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
