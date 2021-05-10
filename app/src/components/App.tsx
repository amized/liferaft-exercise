import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import Page from './Page';
import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { useConfig } from '../context/config';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LOCAL_STORAGE_KEY, API_URL } from '../constants';
import Autosave from './Autosave';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`;

const App: React.FC = () => {
  const [initialEntries, setInitialEntries] = useState<any>(null);
  const schema = useConfig();

  useEffect(() => {
    // Load initial values from local storage
    const entriesJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (entriesJson) {
      const entries = JSON.parse(entriesJson);
      setInitialEntries(entries);
    } else {
      setInitialEntries({});
    }
  }, [schema.application]);

  const handleSubmit = useCallback(async (data) => {
    const payload = JSON.stringify(data);
    await sleep(2000);
    try {
      const result = await fetch(API_URL, {
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json'
        }
      });

      const resultJson = await result.json();
      if (resultJson.error) {
        return { [FORM_ERROR]: 'Submit Failed' };
      }
      return;
    } catch (err) {
      return { [FORM_ERROR]: 'Submit Failed' };
    }
  }, []);

  // App has not initialized yet
  if (initialEntries === null) {
    return null;
  }

  return (
    <>
      <GlobalStyle />
      <Header>
        <h1>Create an account</h1>
      </Header>
      <Main>
        <Router>
          <Form onSubmit={handleSubmit} initialValues={initialEntries}>
            {({
              handleSubmit,
              submitting,
              submitSucceeded,
              submitFailed,
              values
            }) => {
              if (submitSucceeded) {
                return (
                  <SubmitSuccess>
                    <span>&#10003;</span>Thank you, your information has been
                    submitted!
                    <p>We'll be in touch with the next steps.</p>
                  </SubmitSuccess>
                );
              }
              if (submitFailed) {
                return (
                  <SubmitFail>
                    Whoops something went wrong and we weren't able to submit
                    your information.
                  </SubmitFail>
                );
              }
              return (
                <form onSubmit={handleSubmit}>
                  {submitting ? (
                    <Spinner>
                      <SpinnerCircle>
                        <div />
                      </SpinnerCircle>
                    </Spinner>
                  ) : null}
                  <Autosave />
                  <Content submitting={submitting}>
                    <Switch>
                      <Route path="/" exact>
                        <Redirect to={`/${schema.ui[0].path}`} />
                      </Route>
                      {schema.ui.map((page, index) => {
                        const nextRoute = schema.ui[index + 1]?.path;
                        const backRoute = schema.ui[index - 1]?.path;
                        return (
                          <Route path={`/${page.path}`} key={page.path}>
                            <Page
                              fields={page.fields}
                              next={nextRoute}
                              back={backRoute}
                              title={page.title}
                            />
                          </Route>
                        );
                      })}
                    </Switch>
                  </Content>
                </form>
              );
            }}
          </Form>
        </Router>
      </Main>
    </>
  );
};

const Main = styled.main`
  max-width: 700px;
  margin: 0px auto;
  position: relative;
`;

const Header = styled.div`
  background: #4b839a;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
`;

const Content = styled.div<{ submitting: boolean }>`
  transition: opacity 0.2s;
  opacity: ${(props) => (props.submitting ? '0.2' : '1')};
`;

const Spinner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const spinnerAnim = keyframes`
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }

`;

const SpinnerCircle = styled.div`
  display: inline-block;
  transform: translateZ(1px);
  & > div {
    display: inline-block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    background: #0b6b48;
    animation: ${spinnerAnim} 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
`;

const SubmitSuccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 300px;
  color: #0b6b48;
  font-size: 22px;
  transition: transform 0.4s;
  span {
    font-size: 60px;
    display: block;
    margin-bottom: 20px;
  }
`;

const SubmitFail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 300px;
  color: red;
  font-size: 22px;
`;

export default App;
