# example-ssr-caching-hapijs
* This repo is an example hapi.js app with [electrode-react-ssr-caching] module fully integrated
* The step-by-step instructions on building it from scratch can be found below

## <a name="ssr-caching"></a>Electrode React SSR Caching

[electrode-react-ssr-caching] module supports profiling React Server Side Rendering time and component caching to help you speed up SSR.

It supports 2 types of caching:

* Simple - Component Props become the cache key. This is useful for cases like Header and Footer where the number of variations of props data is minimal which will make sure the cache size stays small.
* Template - Components Props are first tokenized and then the generated template html is cached. The idea is akin to generating logic-less handlebars template from your React components and then use string replace to process the template with different props. This is useful for cases like displaying Product information in a Carousel where you have millions of products in the repository.

## Instructions

### <a name="hapijs-server"></a>Hapijs Server
* Let's use the [hapi-universal-redux] repo to scaffold our app.
* Create a hapi app using the following:

```bash
git clone https://github.com/luandro/hapi-universal-redux.git hapiApp
cd hapiApp
npm install
```

* Ensure that you have a working app by running the following:

```bash
npm run dev
```

* From your browser, navigate to `http://localhost:8000` to see the default web page

### <a name="ssr-caching"></a>Electrode React SSR Caching Install
* Install the [electrode-react-ssr-caching] module with the following:

```bash
npm install --save electrode-react-ssr-caching
```

* Import SSRCaching in `hapiApp/src/server.js`

```js
import SSRCaching from "electrode-react-ssr-caching";
```

### *** Important Notes ***
* Make sure the `electrode-react-ssr-caching` module is imported first followed by the imports of `react` and `react-dom` module.
* SSR caching will not work if the ordering is changed since caching module has to have a chance to patch react's code first.
* If you are importing `electrode-react-ssr-caching`, `react` and `react-dom` in the same file, make sure
you are using all `require` or all `import`. Found that SSR caching was NOT working if, `electrode-react-ssr-caching`
is `require`d first and then `react` and `react-dom` is imported.

* Enable caching by adding the configuration code in `hapiApp/src/server.js`

```js
const cacheConfig = {
  components: {
    SSRCachingTemplateType: {
      strategy: "template",
      enable: true
    },
    SSRCachingSimpleType: {
      strategy: "simple",
      enable: true
    }
  }
};

SSRCaching.enableCaching();
SSRCaching.setCachingConfig(cacheConfig);
```

### <a name="ssr-demo-code"></a>SSR Demo Code
* In order to test Server Side Rendering functionality, we need to add a few files:

* For simple strategy, add the following:

`hapiApp/src/components/SSRCachingSimpleType.js`

```js
import React from "react";
import {connect} from "react-redux";

class SSRCachingSimpleTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;

    var elements = [];

	for (var i = 0; i < count; i++) {
      elements.push(<SSRCachingSimpleType key={i} navEntry={"NavEntry" + i} />);
	}

	return (
      <div>
        {elements}
      </div>
    );
  }
}

class SSRCachingSimpleType extends React.Component {
  render() {
    return (
      <div>
	    <p>{this.props.navEntry}</p>
	  </div>
    );
  }
}

const mapStateToProps = (state) => ({
    count: state.count
});

export default connect(
  mapStateToProps
)(SSRCachingSimpleTypeWrapper);
```

* For Template strategy, add the following:

`hapiApp/src/components/SSRCachingTemplateType.js`

```js
import React from "react";
import { connect } from "react-redux";

class SSRCachingTemplateTypeWrapper extends React.Component {
  render() {
    const count = this.props.count;
    var elements = [];

    for(var i = 0; i < count; i++) {
      elements.push(<SSRCachingTemplateType key={i} name={"name"+i} title={"title"+i} rating={"rating"+i}/>);
    }

    return (
      <div>
        { elements }
      </div>
    );
  }
}

class SSRCachingTemplateType extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.name} and {this.props.title} and {this.props.rating}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  count: state.count
})

export default connect(
  mapStateToProps
)(SSRCachingTemplateTypeWrapper);
```

* Add the routes to our new components. Replace the contents of `hapiApp/src/routes.js` with the following:

```js
import React from 'react';
import { Router, Route } from 'react-router';
import Home from './components/Home';
import SSRCachingTemplateType from "./components/SSRCachingTemplateType";
import SSRCachingSimpleType from "./components/SSRCachingSimpleType";

module.exports = (
  <Router>
    <Route>
      <Route path="/" component={Home} />
	  <Route path="/ssrcachingtemplatetype" component={SSRCachingTemplateType} />
      <Route path="/ssrcachingsimpletype" component={SSRCachingSimpleType} />
    </Route>
  </Router>
);
```

* Wire up the home page with our new routes. Replace the contents of `hapiApp/src/components/Home.js` with the following:

```js
import React from "react";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello <a href="https://github.com/electrode-io">Electrode</a></h1>
        <h2>Demonstration Components</h2>
        <ul>
          <li className="ssr simple">
            <a href="/ssrcachingsimpletype">
              SSR Caching - Simple
            </a>
            <p>Component Props become the cache key. This is useful for cases like Header and Footer where the number
            of variations of props data is minimal which will make sure the cache size stays small.</p>
          </li>
          <li className="ssr caching">
            <a href="/ssrcachingtemplatetype">
              SSR Caching- Template Type
            </a>
            <p>Components Props are first tokenized and then the generated template html is cached. The idea is akin to
            generating logic-less handlebars template from your React components and then use string replace to process
            the template with different props. This is useful for cases like displaying Product information in a
            Carousel where you have millions of products in the repository.</p>
          </li>
        </ul>
	  </div>
    );
  }
}
```

### Redux Configuration

* From `hapiApp/src/server.js` replace the line:

```
const store = configureStore();
```

with:

```
const store = configureStore({count: 100});
```

* Replace the contents of `hapiApp/src/reducers/index.js` with the following:

```js
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  routing: routerReducer,
  count: (s=100, a) => s
});

export default rootReducer;
```

* Run the server:

```bash
npm run production
```

* Navigate to the url and port number displayed in the terminal, both links for for Simple and Template Type should return a list of 100 items

### *** Important Notes ***
* SSR caching of components only works in PRODUCTION mode, since the props(which are read only) are mutated for caching purposes and mutating of props is not allowed in development mode by react.


* To read more, go to [electrode-react-ssr-caching]

---

[electrode-react-ssr-caching]: https://github.com/electrode-io/electrode-react-ssr-caching
[hapi-universal-redux]: https://github.com/luandro/hapi-universal-redux