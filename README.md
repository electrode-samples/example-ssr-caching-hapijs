# example-ssr-caching-hapijs
* This repo is an example hapi.js app with [electrode-react-ssr-caching] module fully integrated
* The step-by-step instructions on building it from scratch can be found below

## <a name="ssr-caching"></a>Electrode React SSR Caching

[electrode-react-ssr-caching] module supports profiling React Server Side Rendering time and component caching to help you speed up SSR.

It supports 2 types of caching:

* Simple - Component Props become the cache key. This is useful for cases like Header and Footer where the number of variations of props data is minimal which will make sure the cache size stays small.
* Template - Components Props are first tokenized and then the generated template html is cached. The idea is akin to generating logic-less handlebars template from your React components and then use string replace to process the template with different props. This is useful for cases like displaying Product information in a Carousel where you have millions of products in the repository.

### Install
```bash
$ npm install --save electrode-react-ssr-caching
```

### Wiring

####GOTCHA:

- SSR caching of components only works in PRODUCTION mode, since the props(which are read only) are mutated for caching purposes and mutating of props is not allowed in development mode by react.

- Make sure the `electrode-react-ssr-caching` module is imported first followed by the imports of react and react-dom module. SSR caching will not work if the ordering is changed since caching module has to have a chance to patch react's code first. Also if you are importing `electrode-react-ssr-caching`, `react`  and `react-dom` in the same file , make sure you are using all `require` or all `import`. Found that SSR caching was NOT working if, `electrode-react-ssr-caching` is `require`d first and then `react` and `react-dom` is imported.

---

To demonstrate functionality, we have added:

* `src/components/SSRCachingSimpleType.js` for Simple strategy.
* `src/components/SSRCachingTemplateType.jsx` for Template strategy.
* To enable caching using `electrode-react-ssr-caching`, we need to do the below configuration in `src/server.js`.

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

* To read more, go to [electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)

---

[electrode-react-ssr-caching]: https://github.com/electrode-io/electrode-react-ssr-caching