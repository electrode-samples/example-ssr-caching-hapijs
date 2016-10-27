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
