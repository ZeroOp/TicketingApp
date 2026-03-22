import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from './components/header';

// we have defined our own custom app component. when we route to either index.js or banana.js component what next does is will pass into the _app.js component. 
// this is a some kind of wrapper
const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} currentUser={currentUser} />
            <div>
                <h1>Hello world</h1>
            </div>
        </div>
        
    )
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    const { data } = await client.get('/api/users/currentuser');

    return {
        pageProps,
        currentUser: data.currentUser
    };
};

export default AppComponent;