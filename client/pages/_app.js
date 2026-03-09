import 'bootstrap/dist/css/bootstrap.css'

// we have defined our own custom app component. when we route to either index.js or banana.js component what next does is will pass into the _app.js component. 
// this is a some kind of wrapper
const bootstrap = ({Component, pageProps}) => {
    return <Component {...pageProps} />
};

export default bootstrap;