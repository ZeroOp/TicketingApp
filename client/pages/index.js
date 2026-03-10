// import axios from 'axios' // we can't use use-request because it is a hook. 
// that hook can only be used inside a react compoennt. 
// getInitialProps is not a hook , it is a plain compoennt. 

//  now we don't need the axios anymore we can use buildClient
import buildClient from "../api/build-client";
const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

LandingPage.getInitialProps = async (context) => {
    // req will be passed to the next.js 
    // if (typeof window === 'undefined') {
    //     // we are on the server!
    //     // request should be made to http://ingress
    //     const { data } = await axios.get(
    //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
    //             headers: req.headers
    //         }
    //     );

    //     return data;
    // }
    // else { 
    //     // we are on the browser
    //     // request can be made with a base url of ''
    //     const {data} = await axios('/api/users/currentuser');
    //     return data;
    // }

    // no need to do anything from above 
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');

    return data;
};

export default LandingPage;

/* 
    * When me make a request to auth service from the browser everything worked as expected.

        * ticketing.dev => hostfile is now transfering the ticketing.dev to local host. 
        * something on our computer changed this ticketing.dev to localhost:80
        * That port in localhost:80 is bound to ingress nginx
        * ingress ngnix decided to send the request to client. the response is fully rendered html.
        * we got response successfully.
        * React app made another follow up request to /api/users/currentusers.
        * when ever we don't give the domine the browser will be making request to the current domain. 
        * computer translated /api/users/currentusers to localhost:80/api/users/currentusers. 
        * what happens if we make the same request from the server itself.

    * but when we make the request from the getInitialProps there was some issue. 

        * ticketing.dev => hostfile is now transfering the ticketing.dev to local host. 
        * this request went to ingress Nginx and there was not anything. 
        * so it sent to default service which is client itself.
        * It saw if there was any path or not. 
        * there was no path , so it called index.js. 
        * now getProps function is called. and then we made another request to /api/users/currentuser.
        * node http layer will assume that we are trying to make the request to your localmachine. 
        * which is client itself.
        * so we are ultimately making the request in the client container itself.
        * we are running the next application inside a container. 
        * That container is its own little world. 
        * The request went inside the container.
        * We can use http://auth-srv/somethign , when our services are inside the same namespace. 
        * 
        * ingress ngnix is inside another namespace so we can't use that. 
        *
        * domain we type is
        * 
        * http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local
        * 
        * http://ingress-nginx.ingress-nginx.svc.cluster.local
*/