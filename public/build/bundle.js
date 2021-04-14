
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (209:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(209:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:0) {#if componentParams}
    function create_if_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(202:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn("Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading");

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    	try {
    		window.history.replaceState(undefined, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event("hashchange"));
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute: " + href);
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);

    	node.addEventListener("click", scrollstateHistoryHandler);
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {HTMLElementEventMap} event - an onclick event attached to an anchor tag
     */
    function scrollstateHistoryHandler(event) {
    	// Prevent default anchor onclick behaviour
    	event.preventDefault();

    	const href = event.currentTarget.getAttribute("href");

    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			scrollX: window.scrollX,
    			scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument - strings must start with / or *");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == "string") {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || "/";
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || "/";
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || "") || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	if (restoreScrollState) {
    		window.addEventListener("popstate", event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		});

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.scrollX, previousScrollState.scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick("conditionsFailed", detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoading", Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == "object" && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick("routeLoaded", Object.assign({}, detail, { component, name: component.name }));

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    	});

    	const writable_props = ["routes", "prefix", "restoreScrollState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		scrollstateHistoryHandler,
    		createEventDispatcher,
    		afterUpdate,
    		regexparam,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		lastLoc,
    		componentObj
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(3, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ("restoreScrollState" in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ("props" in $$props) $$invalidate(2, props = $$props.props);
    		if ("previousScrollState" in $$props) previousScrollState = $$props.previousScrollState;
    		if ("lastLoc" in $$props) lastLoc = $$props.lastLoc;
    		if ("componentObj" in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? "manual" : "auto";
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/icons/github.svelte generated by Svelte v3.37.0 */

    const file$k = "src/components/icons/github.svelte";

    function create_fragment$k(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M256,32C132.3,32,32,134.9,32,261.7c0,101.5,64.2,187.5,153.2,217.9c1.4,0.3,2.6,0.4,3.8,0.4c8.3,0,11.5-6.1,11.5-11.4\n\tc0-5.5-0.2-19.9-0.3-39.1c-8.4,1.9-15.9,2.7-22.6,2.7c-43.1,0-52.9-33.5-52.9-33.5c-10.2-26.5-24.9-33.6-24.9-33.6\n\tc-19.5-13.7-0.1-14.1,1.4-14.1c0.1,0,0.1,0,0.1,0c22.5,2,34.3,23.8,34.3,23.8c11.2,19.6,26.2,25.1,39.6,25.1c10.5,0,20-3.4,25.6-6\n\tc2-14.8,7.8-24.9,14.2-30.7c-49.7-5.8-102-25.5-102-113.5c0-25.1,8.7-45.6,23-61.6c-2.3-5.8-10-29.2,2.2-60.8c0,0,1.6-0.5,5-0.5\n\tc8.1,0,26.4,3.1,56.6,24.1c17.9-5.1,37-7.6,56.1-7.7c19,0.1,38.2,2.6,56.1,7.7c30.2-21,48.5-24.1,56.6-24.1c3.4,0,5,0.5,5,0.5\n\tc12.2,31.6,4.5,55,2.2,60.8c14.3,16.1,23,36.6,23,61.6c0,88.2-52.4,107.6-102.3,113.3c8,7.1,15.2,21.1,15.2,42.5\n\tc0,30.7-0.3,55.5-0.3,63c0,5.4,3.1,11.5,11.4,11.5c1.2,0,2.6-0.1,4-0.4C415.9,449.2,480,363.1,480,261.7C480,134.9,379.7,32,256,32z\n\t");
    			add_location(path, file$k, 13, 4, 285);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Layer_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "x", "0px");
    			attr_dev(svg, "y", "0px");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			set_style(svg, "enable-background", "new 0 0 512 512");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$k, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Github", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Github> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Github extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Github",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src/components/icons/search.svelte generated by Svelte v3.37.0 */

    const file$j = "src/components/icons/search.svelte";

    function create_fragment$j(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88l-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24");
    			add_location(path, file$j, 0, 130, 130);
    			attr_dev(svg, "class", "gUZ B9u");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-label", "Search");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Search$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/components/icons/plus.svelte generated by Svelte v3.37.0 */

    const file$i = "src/components/icons/plus.svelte";

    function create_fragment$i(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4");
    			add_location(path, file$i, 0, 151, 151);
    			attr_dev(svg, "class", "gUZ pBj U9O kVc");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "aria-label", "");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Plus", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Plus> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Plus extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plus",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src/components/icons/close.svelte generated by Svelte v3.37.0 */

    const file$h = "src/components/icons/close.svelte";

    function create_fragment$h(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z");
    			add_location(path, file$h, 0, 151, 151);
    			attr_dev(svg, "class", "gUZ pBj U9O kVc");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "aria-label", "");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Close", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Close> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/components/icons/arrowRight.svelte generated by Svelte v3.37.0 */

    const file$g = "src/components/icons/arrowRight.svelte";

    function create_fragment$g(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66");
    			add_location(path, file$g, 9, 2, 166);
    			attr_dev(svg, "class", "transform rotate-180");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "aria-label", "");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ArrowRight", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ArrowRight> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ArrowRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowRight",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/components/icons/arrowLeft.svelte generated by Svelte v3.37.0 */

    const file$f = "src/components/icons/arrowLeft.svelte";

    function create_fragment$f(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66");
    			add_location(path, file$f, 14, 5, 249);
    			attr_dev(svg, "class", /*clazz*/ ctx[0]);
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "aria-label", "");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$f, 5, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*clazz*/ 1) {
    				attr_dev(svg, "class", /*clazz*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ArrowLeft", slots, []);
    	let { class: clazz = "" } = $$props;
    	const writable_props = ["class"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ArrowLeft> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("class" in $$props) $$invalidate(0, clazz = $$props.class);
    	};

    	$$self.$capture_state = () => ({ clazz });

    	$$self.$inject_state = $$props => {
    		if ("clazz" in $$props) $$invalidate(0, clazz = $$props.clazz);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [clazz];
    }

    class ArrowLeft extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowLeft",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get class() {
    		throw new Error("<ArrowLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ArrowLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/icons/home.svelte generated by Svelte v3.37.0 */

    const file$e = "src/components/icons/home.svelte";

    function create_fragment$e(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 0L1 10v14h8v-7a3 3 0 116 0v7h8V10z");
    			add_location(path, file$e, 0, 128, 128);
    			attr_dev(svg, "class", "gUZ pBj");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "aria-label", "Home");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/components/Navigation.svelte generated by Svelte v3.37.0 */
    const file$d = "src/components/Navigation.svelte";

    function create_fragment$d(ctx) {
    	let nav;
    	let div;
    	let button0;
    	let icnhome;
    	let t0;
    	let button1;
    	let icnsearch;
    	let t1;
    	let button2;
    	let icnplus;
    	let current;
    	let mounted;
    	let dispose;
    	icnhome = new Home$1({ $$inline: true });
    	icnsearch = new Search$1({ $$inline: true });
    	icnplus = new Plus({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			button0 = element("button");
    			create_component(icnhome.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			create_component(icnsearch.$$.fragment);
    			t1 = space();
    			button2 = element("button");
    			create_component(icnplus.$$.fragment);
    			attr_dev(button0, "class", "p-1 fill-current rounded-full");
    			add_location(button0, file$d, 12, 8, 393);
    			attr_dev(button1, "class", "p-1 fill-current rounded-full");
    			add_location(button1, file$d, 18, 8, 550);
    			attr_dev(button2, "class", "p-1 fill-current rounded-full");
    			add_location(button2, file$d, 24, 8, 721);
    			attr_dev(div, "class", "flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md px-4");
    			add_location(div, file$d, 9, 4, 278);
    			attr_dev(nav, "id", "navbar");
    			attr_dev(nav, "class", "fixed left-0 flex justify-center items-center bottom-4 w-full z-30 transition-all duration-300 ease-in-out");
    			add_location(nav, file$d, 5, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, button0);
    			mount_component(icnhome, button0, null);
    			append_dev(div, t0);
    			append_dev(div, button1);
    			mount_component(icnsearch, button1, null);
    			append_dev(div, t1);
    			append_dev(div, button2);
    			mount_component(icnplus, button2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnhome.$$.fragment, local);
    			transition_in(icnsearch.$$.fragment, local);
    			transition_in(icnplus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnhome.$$.fragment, local);
    			transition_out(icnsearch.$$.fragment, local);
    			transition_out(icnplus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(icnhome);
    			destroy_component(icnsearch);
    			destroy_component(icnplus);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navigation", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => push("/");
    	const click_handler_1 = () => push("/manga/search");
    	const click_handler_2 = () => push("/manga/favorites");
    	$$self.$capture_state = () => ({ push, IcnHome: Home$1, IcnSearch: Search$1, IcnPlus: Plus });
    	return [click_handler, click_handler_1, click_handler_2];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/Layout.svelte generated by Svelte v3.37.0 */
    const file$c = "src/components/Layout.svelte";

    // (46:4) {#if showNav}
    function create_if_block$5(ctx) {
    	let navigation;
    	let current;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(46:4) {#if showNav}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let header;
    	let h1;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let span;
    	let header_class_value;
    	let t2;
    	let t3;
    	let div0;
    	let div0_class_value;
    	let div1_class_value;
    	let current;
    	let if_block = /*showNav*/ ctx[3] && create_if_block$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Manganya";
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(img, "class", "logo mr-3 svelte-xmveb1");
    			if (img.src !== (img_src_value = "/logo-white.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$c, 40, 16, 1257);
    			attr_dev(span, "class", "text-xl");
    			add_location(span, file$c, 41, 16, 1332);
    			attr_dev(a, "class", "inline-flex");
    			attr_dev(a, "href", "/#/");
    			add_location(a, file$c, 39, 12, 1206);
    			attr_dev(h1, "class", "text-center font-bold");
    			add_location(h1, file$c, 38, 8, 1159);

    			attr_dev(header, "class", header_class_value = /*isLayeringHeader*/ ctx[2]
    			? "py-6 absolute xl:relative w-full top-0 z-10"
    			: "py-6 relative z-10");

    			add_location(header, file$c, 33, 4, 1009);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(`space-y-${/*spaceY*/ ctx[1]}`) + " svelte-xmveb1"));
    			add_location(div0, file$c, 48, 4, 1470);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`max-w-5xl m-auto px-${/*px*/ ctx[0]} relative text-white ${/*myClass*/ ctx[4]}`) + " svelte-xmveb1"));
    			add_location(div1, file$c, 32, 0, 932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			append_dev(header, h1);
    			append_dev(h1, a);
    			append_dev(a, img);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(div1, t2);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*isLayeringHeader*/ 4 && header_class_value !== (header_class_value = /*isLayeringHeader*/ ctx[2]
    			? "py-6 absolute xl:relative w-full top-0 z-10"
    			: "py-6 relative z-10")) {
    				attr_dev(header, "class", header_class_value);
    			}

    			if (/*showNav*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*showNav*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t3);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*spaceY*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(`space-y-${/*spaceY*/ ctx[1]}`) + " svelte-xmveb1"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*px, myClass*/ 17 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`max-w-5xl m-auto px-${/*px*/ ctx[0]} relative text-white ${/*myClass*/ ctx[4]}`) + " svelte-xmveb1"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Layout", slots, ['default']);
    	let { px = 3 } = $$props;
    	let { spaceY = 3 } = $$props;
    	let { isLayeringHeader = false } = $$props;
    	let { showNav = true } = $$props;
    	let { myClass = null } = $$props;

    	if (typeof gtag !== "undefined") {
    		gtag("config", "G-ZGHVTN46GS", { page_path: window.location.hash });
    	}

    	var prevScrollpos = window.pageYOffset;

    	window.onscroll = function () {
    		var currentScrollPos = window.pageYOffset;
    		var nav = document.getElementById("navbar");

    		if (nav) {
    			if (prevScrollpos > currentScrollPos) {
    				nav.classList.add("bottom-4");
    				nav.classList.remove("-bottom-20");
    			} else {
    				nav.classList.add("-bottom-20");
    				nav.classList.remove("bottom-4");
    			}

    			prevScrollpos = currentScrollPos;
    		}
    	};

    	const writable_props = ["px", "spaceY", "isLayeringHeader", "showNav", "myClass"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("px" in $$props) $$invalidate(0, px = $$props.px);
    		if ("spaceY" in $$props) $$invalidate(1, spaceY = $$props.spaceY);
    		if ("isLayeringHeader" in $$props) $$invalidate(2, isLayeringHeader = $$props.isLayeringHeader);
    		if ("showNav" in $$props) $$invalidate(3, showNav = $$props.showNav);
    		if ("myClass" in $$props) $$invalidate(4, myClass = $$props.myClass);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Navigation,
    		px,
    		spaceY,
    		isLayeringHeader,
    		showNav,
    		myClass,
    		prevScrollpos
    	});

    	$$self.$inject_state = $$props => {
    		if ("px" in $$props) $$invalidate(0, px = $$props.px);
    		if ("spaceY" in $$props) $$invalidate(1, spaceY = $$props.spaceY);
    		if ("isLayeringHeader" in $$props) $$invalidate(2, isLayeringHeader = $$props.isLayeringHeader);
    		if ("showNav" in $$props) $$invalidate(3, showNav = $$props.showNav);
    		if ("myClass" in $$props) $$invalidate(4, myClass = $$props.myClass);
    		if ("prevScrollpos" in $$props) prevScrollpos = $$props.prevScrollpos;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [px, spaceY, isLayeringHeader, showNav, myClass, $$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			px: 0,
    			spaceY: 1,
    			isLayeringHeader: 2,
    			showNav: 3,
    			myClass: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get px() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set px(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spaceY() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spaceY(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLayeringHeader() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLayeringHeader(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showNav() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showNav(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get myClass() {
    		throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set myClass(value) {
    		throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ChapterItem.svelte generated by Svelte v3.37.0 */

    const file$b = "src/components/ChapterItem.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let a;
    	let a_href_value;
    	let a_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", a_href_value = "/#/manga/" + /*slug*/ ctx[0] + "/" + /*chapter*/ ctx[1]);

    			attr_dev(a, "class", a_class_value = `text-center flex justify-center items-center ${/*isSelected*/ ctx[2]
			? "bg-gray-900 text-white"
			: "bg-white text-gray-900"} text-lg font-bold hover:bg-gray-900 hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`);

    			add_location(a, file$b, 7, 4, 140);
    			attr_dev(div, "class", "aspect-w-1 aspect-h-1");
    			add_location(div, file$b, 6, 0, 100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*slug, chapter*/ 3 && a_href_value !== (a_href_value = "/#/manga/" + /*slug*/ ctx[0] + "/" + /*chapter*/ ctx[1])) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (!current || dirty & /*isSelected*/ 4 && a_class_value !== (a_class_value = `text-center flex justify-center items-center ${/*isSelected*/ ctx[2]
			? "bg-gray-900 text-white"
			: "bg-white text-gray-900"} text-lg font-bold hover:bg-gray-900 hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`)) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ChapterItem", slots, ['default']);
    	let { slug } = $$props;
    	let { chapter } = $$props;
    	let { isSelected = false } = $$props;
    	const writable_props = ["slug", "chapter", "isSelected"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ChapterItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    		if ("chapter" in $$props) $$invalidate(1, chapter = $$props.chapter);
    		if ("isSelected" in $$props) $$invalidate(2, isSelected = $$props.isSelected);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ slug, chapter, isSelected });

    	$$self.$inject_state = $$props => {
    		if ("slug" in $$props) $$invalidate(0, slug = $$props.slug);
    		if ("chapter" in $$props) $$invalidate(1, chapter = $$props.chapter);
    		if ("isSelected" in $$props) $$invalidate(2, isSelected = $$props.isSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [slug, chapter, isSelected, $$scope, slots];
    }

    class ChapterItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { slug: 0, chapter: 1, isSelected: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChapterItem",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*slug*/ ctx[0] === undefined && !("slug" in props)) {
    			console.warn("<ChapterItem> was created without expected prop 'slug'");
    		}

    		if (/*chapter*/ ctx[1] === undefined && !("chapter" in props)) {
    			console.warn("<ChapterItem> was created without expected prop 'chapter'");
    		}
    	}

    	get slug() {
    		throw new Error("<ChapterItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slug(value) {
    		throw new Error("<ChapterItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get chapter() {
    		throw new Error("<ChapterItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chapter(value) {
    		throw new Error("<ChapterItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<ChapterItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<ChapterItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Loading.svelte generated by Svelte v3.37.0 */

    const file$a = "src/components/Loading.svelte";

    function create_fragment$a(ctx) {
    	let div0;
    	let div0_class_value;
    	let t0;
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t1;
    	let p;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t1 = space();
    			p = element("p");
    			p.textContent = "Loading Moment";

    			attr_dev(div0, "class", div0_class_value = `w-full h-full fixed top-0 bg-gray-900 ${/*isLoading*/ ctx[0]
			? "opacity-100"
			: "opacity-0 invisible"} z-40 transition-all duration-300 ease-in-out`);

    			add_location(div0, file$a, 4, 0, 53);
    			attr_dev(img, "class", "w-1/2 xl:w-2/12 m-auto");
    			if (img.src !== (img_src_value = "/loading.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading");
    			add_location(img, file$a, 17, 8, 473);
    			attr_dev(p, "class", "text-white text-center mt-3 text-lg");
    			add_location(p, file$a, 18, 8, 553);
    			attr_dev(div1, "class", "w-full");
    			add_location(div1, file$a, 16, 4, 444);
    			attr_dev(div2, "id", "loading");

    			attr_dev(div2, "class", div2_class_value = `flex h-screen w-full justify-center items-center z-50 absolute top-0 transition-all duration-300 ease-in-out ${/*isLoading*/ ctx[0]
			? "opacity-100"
			: "opacity-0 invisible"}`);

    			add_location(div2, file$a, 10, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isLoading*/ 1 && div0_class_value !== (div0_class_value = `w-full h-full fixed top-0 bg-gray-900 ${/*isLoading*/ ctx[0]
			? "opacity-100"
			: "opacity-0 invisible"} z-40 transition-all duration-300 ease-in-out`)) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*isLoading*/ 1 && div2_class_value !== (div2_class_value = `flex h-screen w-full justify-center items-center z-50 absolute top-0 transition-all duration-300 ease-in-out ${/*isLoading*/ ctx[0]
			? "opacity-100"
			: "opacity-0 invisible"}`)) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Loading", slots, []);
    	let { isLoading = true } = $$props;
    	const writable_props = ["isLoading"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("isLoading" in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    	};

    	$$self.$capture_state = () => ({ isLoading });

    	$$self.$inject_state = $$props => {
    		if ("isLoading" in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isLoading];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { isLoading: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get isLoading() {
    		throw new Error("<Loading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLoading(value) {
    		throw new Error("<Loading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/FavoriteButton.svelte generated by Svelte v3.37.0 */
    const file$9 = "src/components/FavoriteButton.svelte";

    // (58:8) {:else}
    function create_else_block$2(ctx) {
    	let icnplus;
    	let current;
    	icnplus = new Plus({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icnplus.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icnplus, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnplus.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnplus.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icnplus, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(58:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#if isInFavorite}
    function create_if_block$4(ctx) {
    	let icnclose;
    	let current;
    	icnclose = new Close({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(icnclose.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icnclose, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnclose.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnclose.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icnclose, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(56:8) {#if isInFavorite}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let button;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t0;
    	let span;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isInFavorite*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			span = element("span");
    			span.textContent = "Favorite";
    			attr_dev(span, "class", "pl-3");
    			add_location(span, file$9, 60, 8, 1573);

    			attr_dev(div, "class", div_class_value = `shadow-md fill-current flex justify-center items-center p-2 w-auto rounded-full ${/*isInFavorite*/ ctx[0]
			? "bg-gray-800 text-white"
			: "bg-white text-gray-900"} text-md px-4 font-bold transition-all duration-300 ease-in-out`);

    			add_location(div, file$9, 50, 4, 1195);
    			add_location(button, file$9, 49, 0, 1115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t0);
    			append_dev(div, span);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t0);
    			}

    			if (!current || dirty & /*isInFavorite*/ 1 && div_class_value !== (div_class_value = `shadow-md fill-current flex justify-center items-center p-2 w-auto rounded-full ${/*isInFavorite*/ ctx[0]
			? "bg-gray-800 text-white"
			: "bg-white text-gray-900"} text-md px-4 font-bold transition-all duration-300 ease-in-out`)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getFavorites() {
    	let favorites = JSON.parse(localStorage.getItem("favorites"));
    	favorites = favorites ? favorites : [];
    	return favorites;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FavoriteButton", slots, []);
    	let { data } = $$props;
    	let isInFavorite = false;

    	onMount(() => {
    		let favorites = getFavorites();

    		if (favorites.filter(val => val.slug === data.slug).length > 0) {
    			$$invalidate(0, isInFavorite = true);
    		}
    	});

    	function addFavorite() {
    		let favorites = getFavorites();

    		favorites.unshift({
    			title: data.title,
    			slug: data.slug,
    			cover: data.cover
    		});

    		localStorage.setItem("favorites", JSON.stringify(favorites));
    		$$invalidate(0, isInFavorite = true);
    	}

    	function removeFavorite() {
    		let favorites = getFavorites();
    		localStorage.setItem("favorites", JSON.stringify(favorites.filter(val => val.slug !== data.slug)));
    		$$invalidate(0, isInFavorite = false);
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FavoriteButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => isInFavorite ? removeFavorite() : addFavorite();

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(3, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		IcnPlus: Plus,
    		IcnClose: Close,
    		data,
    		isInFavorite,
    		getFavorites,
    		addFavorite,
    		removeFavorite
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(3, data = $$props.data);
    		if ("isInFavorite" in $$props) $$invalidate(0, isInFavorite = $$props.isInFavorite);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isInFavorite, addFavorite, removeFavorite, data, click_handler];
    }

    class FavoriteButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { data: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FavoriteButton",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[3] === undefined && !("data" in props)) {
    			console.warn("<FavoriteButton> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<FavoriteButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FavoriteButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/manga.svelte generated by Svelte v3.37.0 */
    const file$8 = "src/pages/manga.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (109:0) {:else}
    function create_else_block$1(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(109:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:0) {#if dataset}
    function create_if_block$3(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				px: "0",
    				spaceY: "0",
    				isLayeringHeader: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, dataset, params, continueReading*/ 263) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(31:0) {#if dataset}",
    		ctx
    	});

    	return block;
    }

    // (45:28) {#if continueReading}
    function create_if_block_1$3(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1_value = /*continueReading*/ ctx[2].history.current_chapter + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*continueReading*/ ctx[2].history.next_chapter && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("Lanjut Baca: CH ");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(button, "class", "p-2 px-4 bg-white text-gray-800 rounded-full font-bold text-sm hover:bg-gray-900 hover:text-white shadow-md transition-all duration-300 ease-in-out");
    			add_location(button, file$8, 46, 36, 1663);
    			attr_dev(div, "class", "block space-y-3");
    			add_location(div, file$8, 45, 32, 1597);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*continueReading*/ 4 && t1_value !== (t1_value = /*continueReading*/ ctx[2].history.current_chapter + "")) set_data_dev(t1, t1_value);

    			if (/*continueReading*/ ctx[2].history.next_chapter) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(45:28) {#if continueReading}",
    		ctx
    	});

    	return block;
    }

    // (57:36) {#if continueReading.history.next_chapter}
    function create_if_block_2$2(ctx) {
    	let button;
    	let t0;
    	let t1_value = /*continueReading*/ ctx[2].history.next_chapter + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text("Pindah Ke: CH ");
    			t1 = text(t1_value);
    			attr_dev(button, "class", "p-2 px-4 bg-white text-gray-800 rounded-full font-bold text-sm hover:bg-gray-900 hover:text-white shadow-md transition-all duration-300 ease-in-out");
    			add_location(button, file$8, 57, 40, 2481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*continueReading*/ 4 && t1_value !== (t1_value = /*continueReading*/ ctx[2].history.next_chapter + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(57:36) {#if continueReading.history.next_chapter}",
    		ctx
    	});

    	return block;
    }

    // (101:24) <ChapterItem {chapter} slug={params.slug}                             >
    function create_default_slot_1$2(ctx) {
    	let t_value = /*chapter*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 2 && t_value !== (t_value = /*chapter*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(101:24) <ChapterItem {chapter} slug={params.slug}                             >",
    		ctx
    	});

    	return block;
    }

    // (100:20) {#each dataset.chapters as chapter}
    function create_each_block$4(ctx) {
    	let chapteritem;
    	let current;

    	chapteritem = new ChapterItem({
    			props: {
    				chapter: /*chapter*/ ctx[5],
    				slug: /*params*/ ctx[0].slug,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chapteritem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chapteritem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chapteritem_changes = {};
    			if (dirty & /*dataset*/ 2) chapteritem_changes.chapter = /*chapter*/ ctx[5];
    			if (dirty & /*params*/ 1) chapteritem_changes.slug = /*params*/ ctx[0].slug;

    			if (dirty & /*$$scope, dataset*/ 258) {
    				chapteritem_changes.$$scope = { dirty, ctx };
    			}

    			chapteritem.$set(chapteritem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chapteritem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chapteritem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chapteritem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(100:20) {#each dataset.chapters as chapter}",
    		ctx
    	});

    	return block;
    }

    // (32:4) <Layout px="0" spaceY="0" isLayeringHeader={true}>
    function create_default_slot$4(ctx) {
    	let div9;
    	let div6;
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div4;
    	let div2;
    	let t1;
    	let div1;
    	let favoritebutton;
    	let t2;
    	let div3;
    	let h1;
    	let t3_value = /*dataset*/ ctx[1].title + "";
    	let t3;
    	let t4;
    	let hr;
    	let t5;
    	let p;
    	let t6_value = /*dataset*/ ctx[1].sinopsis + "";
    	let t6;
    	let t7;
    	let div8;
    	let div7;
    	let current;
    	let if_block = /*continueReading*/ ctx[2] && create_if_block_1$3(ctx);

    	favoritebutton = new FavoriteButton({
    			props: {
    				data: {
    					title: /*dataset*/ ctx[1].title,
    					slug: /*params*/ ctx[0].slug,
    					cover: /*dataset*/ ctx[1].cover
    				}
    			},
    			$$inline: true
    		});

    	let each_value = /*dataset*/ ctx[1].chapters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			create_component(favoritebutton.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			h1 = element("h1");
    			t3 = text(t3_value);
    			t4 = space();
    			hr = element("hr");
    			t5 = space();
    			p = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			div8 = element("div");
    			div7 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (img.src !== (img_src_value = /*dataset*/ ctx[1].cover)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Solo Leveling");
    			attr_dev(img, "class", "w-full pr-0 h-full block  top-3");
    			add_location(img, file$8, 36, 24, 1168);
    			attr_dev(div0, "class", "bg-black opacity-40 w-full xl:w-3/4");
    			add_location(div0, file$8, 35, 20, 1094);
    			attr_dev(div1, "class", "flex mt-auto");
    			add_location(div1, file$8, 70, 28, 3351);
    			attr_dev(div2, "class", "flex mb-6 ");
    			add_location(div2, file$8, 43, 24, 1490);
    			attr_dev(h1, "class", "text-xl font-bold");
    			add_location(h1, file$8, 82, 28, 3897);
    			attr_dev(hr, "class", "w-2/4 border-none h-0.5 bg-white rounded-full");
    			add_location(hr, file$8, 85, 28, 4038);
    			add_location(p, file$8, 88, 28, 4187);
    			attr_dev(div3, "class", "space-y-3 bg-gray-800 rounded-lg p-5");
    			add_location(div3, file$8, 81, 24, 3818);
    			attr_dev(div4, "class", "px-3 -top-52 xl:w-3/4 relative shadow-lg");
    			add_location(div4, file$8, 42, 20, 1411);
    			attr_dev(div5, "class", "block xl:sticky top-0");
    			add_location(div5, file$8, 34, 16, 1038);
    			attr_dev(div6, "class", "relative xl:w-1/2 xl:top-0");
    			add_location(div6, file$8, 33, 12, 981);
    			attr_dev(div7, "class", "grid grid-cols-5 xl:grid-cols-6 gap-3");
    			add_location(div7, file$8, 98, 16, 4512);
    			attr_dev(div8, "class", "px-3 w-full xl:w-1/2 xl:px-0 -mt-52 xl:mt-0 relative pt-8 xl:pt-0");
    			add_location(div8, file$8, 95, 12, 4387);
    			attr_dev(div9, "class", "block xl:flex");
    			add_location(div9, file$8, 32, 8, 941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(favoritebutton, div1, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, h1);
    			append_dev(h1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, hr);
    			append_dev(div3, t5);
    			append_dev(div3, p);
    			append_dev(p, t6);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    			append_dev(div8, div7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div7, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*dataset*/ 2 && img.src !== (img_src_value = /*dataset*/ ctx[1].cover)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*continueReading*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					if_block.m(div2, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const favoritebutton_changes = {};

    			if (dirty & /*dataset, params*/ 3) favoritebutton_changes.data = {
    				title: /*dataset*/ ctx[1].title,
    				slug: /*params*/ ctx[0].slug,
    				cover: /*dataset*/ ctx[1].cover
    			};

    			favoritebutton.$set(favoritebutton_changes);
    			if ((!current || dirty & /*dataset*/ 2) && t3_value !== (t3_value = /*dataset*/ ctx[1].title + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*dataset*/ 2) && t6_value !== (t6_value = /*dataset*/ ctx[1].sinopsis + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*dataset, params*/ 3) {
    				each_value = /*dataset*/ ctx[1].chapters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div7, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favoritebutton.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favoritebutton.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			if (if_block) if_block.d();
    			destroy_component(favoritebutton);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(32:4) <Layout px=\\\"0\\\" spaceY=\\\"0\\\" isLayeringHeader={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*dataset*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Manga", slots, []);
    	let { params } = $$props;
    	let dataset;
    	let continueReading;

    	onMount(async () => {
    		await fetch("/api/manga/" + params.slug).then(r => r.json()).then(data => {
    			$$invalidate(1, dataset = data);
    		});
    	});

    	onMount(() => {
    		let histories = JSON.parse(localStorage.getItem("histories"));
    		histories = histories ? histories : [];
    		$$invalidate(2, continueReading = histories.filter(val => val.slug === params.slug)[0]);
    	});

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Manga> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => push(`/manga/${params.slug}/${continueReading.history.current_chapter}`);
    	const click_handler_1 = () => push(`/manga/${params.slug}/${continueReading.history.next_chapter}`);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Layout,
    		ChapterItem,
    		onMount,
    		Loading,
    		push,
    		FavoriteButton,
    		params,
    		dataset,
    		continueReading
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("dataset" in $$props) $$invalidate(1, dataset = $$props.dataset);
    		if ("continueReading" in $$props) $$invalidate(2, continueReading = $$props.continueReading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, dataset, continueReading, click_handler, click_handler_1];
    }

    class Manga extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Manga",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[0] === undefined && !("params" in props)) {
    			console.warn("<Manga> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<Manga>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Manga>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MangaItem.svelte generated by Svelte v3.37.0 */

    const file$7 = "src/components/MangaItem.svelte";

    function create_fragment$7(ctx) {
    	let a;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let img_class_value;
    	let div1_class_value;
    	let t0;
    	let div2;
    	let p;
    	let t1_value = /*data*/ ctx[0].title + "";
    	let t1;
    	let p_class_value;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div2 = element("div");
    			p = element("p");
    			t1 = text(t1_value);
    			if (img.src !== (img_src_value = /*data*/ ctx[0].cover)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[0].title);
    			attr_dev(img, "width", "100%");
    			attr_dev(img, "class", img_class_value = `transition-all duration-300 ease-in-out ${/*isImageOnLoad*/ ctx[1] ? "opacity-100" : "opacity-0"}`);
    			add_location(img, file$7, 18, 12, 411);
    			add_location(div0, file$7, 17, 8, 393);

    			attr_dev(div1, "class", div1_class_value = `bg-gray-800 aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${!/*isImageOnLoad*/ ctx[1]
			? "animate-pulse"
			: "animate-none"}`);

    			add_location(div1, file$7, 12, 4, 220);

    			attr_dev(p, "class", p_class_value = `text-lg w-full truncate font-bold text-white transition-all duration-300 ease-in-out ${/*isImageOnLoad*/ ctx[1]
			? "opacity-100 animate-none"
			: "opacity-0 animate-pulse"}`);

    			add_location(p, file$7, 30, 8, 773);
    			attr_dev(div2, "class", "mt-3");
    			add_location(div2, file$7, 29, 4, 746);
    			attr_dev(a, "href", a_href_value = "#/manga/" + /*data*/ ctx[0].slug);
    			add_location(a, file$7, 11, 0, 185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(a, t0);
    			append_dev(a, div2);
    			append_dev(div2, p);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = listen_dev(img, "load", /*updateLoad*/ ctx[2](), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && img.src !== (img_src_value = /*data*/ ctx[0].cover)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 1 && img_alt_value !== (img_alt_value = /*data*/ ctx[0].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*isImageOnLoad*/ 2 && img_class_value !== (img_class_value = `transition-all duration-300 ease-in-out ${/*isImageOnLoad*/ ctx[1] ? "opacity-100" : "opacity-0"}`)) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*isImageOnLoad*/ 2 && div1_class_value !== (div1_class_value = `bg-gray-800 aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${!/*isImageOnLoad*/ ctx[1]
			? "animate-pulse"
			: "animate-none"}`)) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*data*/ 1 && t1_value !== (t1_value = /*data*/ ctx[0].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*isImageOnLoad*/ 2 && p_class_value !== (p_class_value = `text-lg w-full truncate font-bold text-white transition-all duration-300 ease-in-out ${/*isImageOnLoad*/ ctx[1]
			? "opacity-100 animate-none"
			: "opacity-0 animate-pulse"}`)) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (dirty & /*data*/ 1 && a_href_value !== (a_href_value = "#/manga/" + /*data*/ ctx[0].slug)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MangaItem", slots, []);
    	let { data } = $$props;
    	let isImageOnLoad = false;

    	function updateLoad() {
    		setTimeout(
    			() => {
    				$$invalidate(1, isImageOnLoad = true);
    			},
    			200
    		);
    	}

    	const writable_props = ["data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MangaItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ data, isImageOnLoad, updateLoad });

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(0, data = $$props.data);
    		if ("isImageOnLoad" in $$props) $$invalidate(1, isImageOnLoad = $$props.isImageOnLoad);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, isImageOnLoad, updateLoad];
    }

    class MangaItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MangaItem",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !("data" in props)) {
    			console.warn("<MangaItem> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<MangaItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<MangaItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/home.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/pages/home.svelte";

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (26:4) {#if continueReading.length > 0}
    function create_if_block_1$2(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let div;
    	let current;
    	let each_value_2 = /*continueReading*/ ctx[1].slice(0, 5);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Lanjut Baca";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "font-bold text-2xl mb-5");
    			add_location(h2, file$6, 27, 12, 692);
    			attr_dev(div, "class", "grid grid-cols-2 xl:grid-cols-5 gap-6");
    			add_location(div, file$6, 28, 12, 757);
    			attr_dev(section, "class", "mb-6");
    			add_location(section, file$6, 26, 8, 657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*continueReading*/ 2) {
    				each_value_2 = /*continueReading*/ ctx[1].slice(0, 5);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(26:4) {#if continueReading.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (30:16) {#each continueReading.slice(0, 5) as data}
    function create_each_block_2(ctx) {
    	let mangaitem;
    	let current;

    	mangaitem = new MangaItem({
    			props: { data: /*data*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mangaitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mangaitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mangaitem_changes = {};
    			if (dirty & /*continueReading*/ 2) mangaitem_changes.data = /*data*/ ctx[2];
    			mangaitem.$set(mangaitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mangaitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mangaitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mangaitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(30:16) {#each continueReading.slice(0, 5) as data}",
    		ctx
    	});

    	return block;
    }

    // (44:12) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Array(40);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(44:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (40:12) {#if dataset.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*dataset*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1) {
    				each_value = /*dataset*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(40:12) {#if dataset.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (45:16) {#each Array(40) as _}
    function create_each_block_1$1(ctx) {
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let div2;
    	let t1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			t1 = space();
    			attr_dev(div0, "class", "animate-pulse bg-gray-800");
    			add_location(div0, file$6, 49, 28, 1531);
    			attr_dev(div1, "class", "aspect-w-1 aspect-h-1 rounded-md overflow-hidden");
    			add_location(div1, file$6, 46, 24, 1387);
    			attr_dev(div2, "class", "mt-3 sk-t sk-t w-full bg-gray-800 animate-pulse rounded-md svelte-1ohngm6");
    			add_location(div2, file$6, 51, 24, 1628);
    			attr_dev(div3, "class", "animate-pulse");
    			add_location(div3, file$6, 45, 20, 1335);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div3, t1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(45:16) {#each Array(40) as _}",
    		ctx
    	});

    	return block;
    }

    // (41:16) {#each dataset as data}
    function create_each_block$3(ctx) {
    	let mangaitem;
    	let current;

    	mangaitem = new MangaItem({
    			props: { data: /*data*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mangaitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mangaitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mangaitem_changes = {};
    			if (dirty & /*dataset*/ 1) mangaitem_changes.data = /*data*/ ctx[2];
    			mangaitem.$set(mangaitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mangaitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mangaitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mangaitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(41:16) {#each dataset as data}",
    		ctx
    	});

    	return block;
    }

    // (25:0) <Layout spaceY="0">
    function create_default_slot$3(ctx) {
    	let t0;
    	let section;
    	let h2;
    	let t2;
    	let div;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*continueReading*/ ctx[1].length > 0 && create_if_block_1$2(ctx);
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*dataset*/ ctx[0].length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Terbaru";
    			t2 = space();
    			div = element("div");
    			if_block1.c();
    			attr_dev(h2, "class", "font-bold text-2xl mb-5");
    			add_location(h2, file$6, 37, 8, 1005);
    			attr_dev(div, "class", "grid grid-cols-2 xl:grid-cols-5 gap-6");
    			add_location(div, file$6, 38, 8, 1062);
    			add_location(section, file$6, 36, 4, 987);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t2);
    			append_dev(section, div);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*continueReading*/ ctx[1].length > 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*continueReading*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(25:0) <Layout spaceY=\\\"0\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				spaceY: "0",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, dataset, continueReading*/ 1027) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let dataset = [];
    	let continueReading = [];

    	onMount(async () => {
    		await fetch("/api").then(r => r.json()).then(data => {
    			$$invalidate(0, dataset = data.data);
    		});
    	});

    	onMount(() => {
    		let histories = JSON.parse(localStorage.getItem("histories"));
    		histories = histories ? histories : [];
    		$$invalidate(1, continueReading = histories);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Layout,
    		MangaItem,
    		onMount,
    		dataset,
    		continueReading
    	});

    	$$self.$inject_state = $$props => {
    		if ("dataset" in $$props) $$invalidate(0, dataset = $$props.dataset);
    		if ("continueReading" in $$props) $$invalidate(1, continueReading = $$props.continueReading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataset, continueReading];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function useEffect(cb, deps) {
        let cleanup;

        function apply() {
            if (cleanup) cleanup();
            cleanup = cb();
        }

        if (deps) {
            let values = [];
            afterUpdate(() => {
                const new_values = deps();
                if (new_values.some((value, i) => value !== values[i])) {
                    apply();
                    values = new_values;
                }
            });
        } else {
            // no deps = always run
            afterUpdate(apply);
        }

        onDestroy(() => {
            if (cleanup) cleanup();
        });
    }

    /* src/pages/readManga.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/pages/readManga.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	child_ctx[20] = i;
    	return child_ctx;
    }

    // (149:0) {#if !loading}
    function create_if_block$1(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				px: "0",
    				showNav: false,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, dataset, isChapterBarOpen, params, loadedImages*/ 2097175) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(149:0) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (155:12) {#each dataset.data as url, i}
    function create_each_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	function load_handler() {
    		return /*load_handler*/ ctx[6](/*i*/ ctx[20]);
    	}

    	function error_handler(...args) {
    		return /*error_handler*/ ctx[7](/*url*/ ctx[18], ...args);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "w-full");
    			if (img.src !== (img_src_value = /*url*/ ctx[18].main_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = `${/*dataset*/ ctx[1].title}-image-${/*i*/ ctx[20] + 1}`);
    			add_location(img, file$5, 155, 16, 5267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "load", load_handler, false, false, false),
    					listen_dev(img, "error", error_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*dataset*/ 2 && img.src !== (img_src_value = /*url*/ ctx[18].main_url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*dataset*/ 2 && img_alt_value !== (img_alt_value = `${/*dataset*/ ctx[1].title}-image-${/*i*/ ctx[20] + 1}`)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(155:12) {#each dataset.data as url, i}",
    		ctx
    	});

    	return block;
    }

    // (181:32) <ChapterItem                                     isSelected={chapter === params.chapter}                                     {chapter}                                     slug={params.slug}>
    function create_default_slot_1$1(ctx) {
    	let t_value = /*chapter*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 2 && t_value !== (t_value = /*chapter*/ ctx[15] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(181:32) <ChapterItem                                     isSelected={chapter === params.chapter}                                     {chapter}                                     slug={params.slug}>",
    		ctx
    	});

    	return block;
    }

    // (179:24) {#each dataset.chapters as chapter}
    function create_each_block$2(ctx) {
    	let div;
    	let chapteritem;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	chapteritem = new ChapterItem({
    			props: {
    				isSelected: /*chapter*/ ctx[15] === /*params*/ ctx[0].chapter,
    				chapter: /*chapter*/ ctx[15],
    				slug: /*params*/ ctx[0].slug,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(chapteritem.$$.fragment);
    			t = space();
    			add_location(div, file$5, 179, 28, 6375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(chapteritem, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*call*/ ctx[5](/*chapter*/ ctx[15]))) /*call*/ ctx[5](/*chapter*/ ctx[15]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const chapteritem_changes = {};
    			if (dirty & /*dataset, params*/ 3) chapteritem_changes.isSelected = /*chapter*/ ctx[15] === /*params*/ ctx[0].chapter;
    			if (dirty & /*dataset*/ 2) chapteritem_changes.chapter = /*chapter*/ ctx[15];
    			if (dirty & /*params*/ 1) chapteritem_changes.slug = /*params*/ ctx[0].slug;

    			if (dirty & /*$$scope, dataset*/ 2097154) {
    				chapteritem_changes.$$scope = { dirty, ctx };
    			}

    			chapteritem.$set(chapteritem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chapteritem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chapteritem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(chapteritem);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(179:24) {#each dataset.chapters as chapter}",
    		ctx
    	});

    	return block;
    }

    // (209:16) {#if dataset.prev}
    function create_if_block_2$1(ctx) {
    	let button;
    	let icnarrowleft;
    	let current;
    	let mounted;
    	let dispose;
    	icnarrowleft = new ArrowLeft({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icnarrowleft.$$.fragment);
    			attr_dev(button, "class", "p-1 fill-current rounded-full");
    			add_location(button, file$5, 209, 20, 7635);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icnarrowleft, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*call*/ ctx[5](/*dataset*/ ctx[1].prev))) /*call*/ ctx[5](/*dataset*/ ctx[1].prev).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnarrowleft.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnarrowleft.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icnarrowleft);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(209:16) {#if dataset.prev}",
    		ctx
    	});

    	return block;
    }

    // (223:16) {#if dataset.next}
    function create_if_block_1$1(ctx) {
    	let button;
    	let icnarrowright;
    	let current;
    	let mounted;
    	let dispose;
    	icnarrowright = new ArrowRight({ $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icnarrowright.$$.fragment);
    			attr_dev(button, "class", "p-1 fill-current rounded-full");
    			add_location(button, file$5, 223, 20, 8168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icnarrowright, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*call*/ ctx[5](/*dataset*/ ctx[1].next))) /*call*/ ctx[5](/*dataset*/ ctx[1].next).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnarrowright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnarrowright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icnarrowright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(223:16) {#if dataset.next}",
    		ctx
    	});

    	return block;
    }

    // (150:4) <Layout px="0" showNav={false}>
    function create_default_slot$2(ctx) {
    	let h1;
    	let t0_value = /*dataset*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2;
    	let button0;
    	let icnarrowleft;
    	let t3;
    	let nav0;
    	let div3;
    	let h2;
    	let t5;
    	let div2;
    	let div1;
    	let t6;
    	let button1;
    	let icnhome;
    	let t7;
    	let button2;
    	let icnclose;
    	let nav0_class_value;
    	let t8;
    	let nav1;
    	let div4;
    	let t9;
    	let button3;
    	let t10_value = /*params*/ ctx[0].chapter + "";
    	let t10;
    	let t11;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*dataset*/ ctx[1].data;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	icnarrowleft = new ArrowLeft({
    			props: { class: "transform rotate-90 m-auto" },
    			$$inline: true
    		});

    	let each_value = /*dataset*/ ctx[1].chapters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	icnhome = new Home$1({ $$inline: true });
    	icnclose = new Close({ $$inline: true });
    	let if_block0 = /*dataset*/ ctx[1].prev && create_if_block_2$1(ctx);
    	let if_block1 = /*dataset*/ ctx[1].next && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			button0 = element("button");
    			create_component(icnarrowleft.$$.fragment);
    			t3 = space();
    			nav0 = element("nav");
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Pilih Chapter";
    			t5 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			button1 = element("button");
    			create_component(icnhome.$$.fragment);
    			t7 = space();
    			button2 = element("button");
    			create_component(icnclose.$$.fragment);
    			t8 = space();
    			nav1 = element("nav");
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t9 = space();
    			button3 = element("button");
    			t10 = text(t10_value);
    			t11 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(h1, "class", "text-3xl text-center px-3 font-bold");
    			add_location(h1, file$5, 150, 8, 5081);
    			attr_dev(div0, "class", "m-auto w-full");
    			add_location(div0, file$5, 153, 8, 5180);
    			attr_dev(button0, "class", "p-3 w-full bg-gray-800 text-white fill-current");
    			add_location(button0, file$5, 164, 8, 5597);
    			attr_dev(h2, "class", "text-center font-bold text-lg");
    			add_location(h2, file$5, 175, 16, 6098);
    			attr_dev(div1, "class", "grid grid-cols-5 xl:grid-cols-12 gap-3");
    			add_location(div1, file$5, 177, 20, 6234);
    			attr_dev(div2, "class", "overflow-y-auto max-h-96");
    			add_location(div2, file$5, 176, 16, 6175);
    			attr_dev(button1, "class", "p-1 fill-current w-full flex items-center justify-center");
    			add_location(button1, file$5, 189, 16, 6818);
    			attr_dev(button2, "class", "p-1 fill-current w-full flex items-center justify-center");
    			add_location(button2, file$5, 193, 16, 7012);
    			attr_dev(div3, "class", "p-3 space-y-3");
    			add_location(div3, file$5, 174, 12, 6054);

    			attr_dev(nav0, "class", nav0_class_value = `fixed w-full xl:max-w-5xl ${/*isChapterBarOpen*/ ctx[4]
			? "bottom-0"
			: "-bottom-full"} bg-gray-800 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`);

    			add_location(nav0, file$5, 169, 8, 5814);
    			attr_dev(button3, "class", "p-1 fill-current rounded-full");
    			add_location(button3, file$5, 216, 16, 7890);
    			attr_dev(div4, "class", "flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md");
    			add_location(div4, file$5, 205, 12, 7462);
    			attr_dev(nav1, "id", "navbar");
    			attr_dev(nav1, "class", "fixed left-0 flex justify-center items-center bottom-4 w-full z-10 transition-all duration-300 ease-in-out");
    			add_location(nav1, file$5, 201, 8, 7284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			mount_component(icnarrowleft, button0, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, nav0, anchor);
    			append_dev(nav0, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div3, t6);
    			append_dev(div3, button1);
    			mount_component(icnhome, button1, null);
    			append_dev(div3, t7);
    			append_dev(div3, button2);
    			mount_component(icnclose, button2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, nav1, anchor);
    			append_dev(nav1, div4);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t9);
    			append_dev(div4, button3);
    			append_dev(button3, t10);
    			append_dev(div4, t11);
    			if (if_block1) if_block1.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[10], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*dataset*/ 2) && t0_value !== (t0_value = /*dataset*/ ctx[1].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*dataset, loadedImages*/ 6) {
    				each_value_1 = /*dataset*/ ctx[1].data;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*call, dataset, params*/ 35) {
    				each_value = /*dataset*/ ctx[1].chapters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*isChapterBarOpen*/ 16 && nav0_class_value !== (nav0_class_value = `fixed w-full xl:max-w-5xl ${/*isChapterBarOpen*/ ctx[4]
			? "bottom-0"
			: "-bottom-full"} bg-gray-800 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`)) {
    				attr_dev(nav0, "class", nav0_class_value);
    			}

    			if (/*dataset*/ ctx[1].prev) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*dataset*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div4, t9);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*params*/ 1) && t10_value !== (t10_value = /*params*/ ctx[0].chapter + "")) set_data_dev(t10, t10_value);

    			if (/*dataset*/ ctx[1].next) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*dataset*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icnarrowleft.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(icnhome.$$.fragment, local);
    			transition_in(icnclose.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icnarrowleft.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(icnhome.$$.fragment, local);
    			transition_out(icnclose.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			destroy_component(icnarrowleft);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(nav0);
    			destroy_each(each_blocks, detaching);
    			destroy_component(icnhome);
    			destroy_component(icnclose);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(nav1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(150:4) <Layout px=\\\"0\\\" showNav={false}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let loading_1;
    	let t;
    	let if_block_anchor;
    	let current;

    	loading_1 = new Loading({
    			props: { isLoading: /*loading*/ ctx[3] },
    			$$inline: true
    		});

    	let if_block = !/*loading*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const loading_1_changes = {};
    			if (dirty & /*loading*/ 8) loading_1_changes.isLoading = /*loading*/ ctx[3];
    			loading_1.$set(loading_1_changes);

    			if (!/*loading*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*loading*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ReadManga", slots, []);
    	let { params } = $$props;
    	let dataset;
    	let loadedImages = 0;
    	let loading = true;
    	let isChapterBarOpen = false;
    	let inHistory = null;
    	let InHistories = [];
    	var prevScrollpos = window.pageYOffset;

    	onMount(async () => {
    		call(params.chapter);
    	});

    	onMount(() => {
    		window.addEventListener("scroll", function () {
    			var currentScrollPos = window.pageYOffset;
    			var nav = document.getElementById("navbar");

    			if (nav) {
    				if (prevScrollpos > currentScrollPos) {
    					nav.classList.add("bottom-4");
    					nav.classList.remove("-bottom-20");
    				} else {
    					nav.classList.add("-bottom-20");
    					nav.classList.remove("bottom-4");
    				}

    				prevScrollpos = currentScrollPos;
    			}

    			//  update inHistory
    			if (inHistory && window.location.href === window.location.origin + "/#/manga/" + params.slug + "/" + params.chapter) {
    				inHistory.pageYOffset = currentScrollPos;
    				InHistories[InHistories.findIndex(x => x.slug === inHistory.slug)] = inHistory;
    				localStorage.setItem("histories", JSON.stringify(InHistories));
    			}
    		});
    	});

    	useEffect(
    		() => {
    			if (dataset) {
    				if (dataset.data.length === loadedImages) {
    					if (inHistory.history.current_chapter === params.chapter) {
    						setTimeout(
    							() => {
    								window.scrollTo(0, inHistory.pageYOffset);
    							},
    							600
    						);
    					}
    				}
    			}
    		},
    		() => [loadedImages]
    	);

    	async function call(chapter, rplc = true) {
    		$$invalidate(3, loading = true);
    		window.scrollTo(0, 0);

    		if (rplc) {
    			replace(`/manga/${params.slug}/${chapter}`);
    		}

    		await fetch(`/api/manga/${params.slug}/${chapter}`).then(r => r.json()).then(data => {
    			$$invalidate(1, dataset = data);
    			$$invalidate(3, loading = false);

    			//  update hitory
    			let histories = JSON.parse(localStorage.getItem("histories"));

    			histories = histories ? histories : [];
    			let exitingManga = histories.filter(val => val.slug === params.slug);

    			if (exitingManga.length > 0) {
    				//  update exiting manga
    				histories = histories.filter(val => val.slug !== dataset.slug);

    				exitingManga = exitingManga[0];
    				exitingManga.title = dataset.title;
    				exitingManga.cover = dataset.cover;
    				exitingManga.history.previous_chapter = dataset.prev;
    				exitingManga.history.current_chapter = dataset.current;
    				exitingManga.history.next_chapter = dataset.next;

    				if (exitingManga.history.chapters.filter(val => val === params.chapter).length === 0) {
    					exitingManga.history.chapters.unshift(params.chapter);
    				}

    				histories.unshift(exitingManga);
    			} else {
    				//  add new manga to history
    				exitingManga = {
    					title: dataset.title,
    					slug: dataset.slug,
    					cover: dataset.cover,
    					pageYOffset: 0,
    					history: {
    						previous_chapter: dataset.prev,
    						current_chapter: dataset.current,
    						next_chapter: dataset.next,
    						chapters: [dataset.chapter]
    					}
    				};

    				histories.unshift(exitingManga);
    			}

    			inHistory = exitingManga;
    			InHistories = histories;
    			localStorage.setItem("histories", JSON.stringify(histories));
    		});
    	}

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ReadManga> was created with unknown prop '${key}'`);
    	});

    	const load_handler = i => $$invalidate(2, loadedImages = i + 1);
    	const error_handler = (url, e) => e.target.src = url.backup_url;
    	const click_handler = () => window.scrollTo(0, 0);
    	const click_handler_1 = () => push("/");
    	const click_handler_2 = () => $$invalidate(4, isChapterBarOpen = !isChapterBarOpen);
    	const click_handler_3 = () => $$invalidate(4, isChapterBarOpen = !isChapterBarOpen);

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		Layout,
    		onMount,
    		Loading,
    		useEffect,
    		push,
    		IcnArrowLeft: ArrowLeft,
    		IcnArrowRight: ArrowRight,
    		IcnClose: Close,
    		IcnHome: Home$1,
    		replace,
    		ChapterItem,
    		params,
    		dataset,
    		loadedImages,
    		loading,
    		isChapterBarOpen,
    		inHistory,
    		InHistories,
    		prevScrollpos,
    		call
    	});

    	$$self.$inject_state = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    		if ("dataset" in $$props) $$invalidate(1, dataset = $$props.dataset);
    		if ("loadedImages" in $$props) $$invalidate(2, loadedImages = $$props.loadedImages);
    		if ("loading" in $$props) $$invalidate(3, loading = $$props.loading);
    		if ("isChapterBarOpen" in $$props) $$invalidate(4, isChapterBarOpen = $$props.isChapterBarOpen);
    		if ("inHistory" in $$props) inHistory = $$props.inHistory;
    		if ("InHistories" in $$props) InHistories = $$props.InHistories;
    		if ("prevScrollpos" in $$props) prevScrollpos = $$props.prevScrollpos;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		params,
    		dataset,
    		loadedImages,
    		loading,
    		isChapterBarOpen,
    		call,
    		load_handler,
    		error_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class ReadManga extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { params: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ReadManga",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[0] === undefined && !("params" in props)) {
    			console.warn("<ReadManga> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<ReadManga>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<ReadManga>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.37.0 */

    const file$4 = "src/components/Button.svelte";

    function create_fragment$4(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "type", /*type*/ ctx[1]);
    			attr_dev(button, "class", "p-3 rounded-full outline-none bg-gray-800 w-full shadow-xl hover:bg-gray-900 transition-all ease-in-out duration-300");
    			add_location(button, file$4, 5, 0, 72);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onclick*/ ctx[0])) /*onclick*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*type*/ 2) {
    				attr_dev(button, "type", /*type*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	let { onclick = null } = $$props;
    	let { type } = $$props;
    	const writable_props = ["onclick", "type"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("onclick" in $$props) $$invalidate(0, onclick = $$props.onclick);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onclick, type });

    	$$self.$inject_state = $$props => {
    		if ("onclick" in $$props) $$invalidate(0, onclick = $$props.onclick);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onclick, type, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { onclick: 0, type: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[1] === undefined && !("type" in props)) {
    			console.warn("<Button> was created without expected prop 'type'");
    		}
    	}

    	get onclick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onclick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Input.svelte generated by Svelte v3.37.0 */

    const file$3 = "src/components/Input.svelte";

    function create_fragment$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "w-full p-3 rounded-full outline-none text-gray-900 px-6");
    			attr_dev(input, "placeholder", /*placeholder*/ ctx[1]);
    			add_location(input, file$3, 5, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placeholder*/ 2) {
    				attr_dev(input, "placeholder", /*placeholder*/ ctx[1]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Input", slots, []);
    	let { placeholder = null } = $$props;
    	let { value = "" } = $$props;
    	const writable_props = ["placeholder", "value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ("placeholder" in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ placeholder, value });

    	$$self.$inject_state = $$props => {
    		if ("placeholder" in $$props) $$invalidate(1, placeholder = $$props.placeholder);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, placeholder, input_input_handler];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { placeholder: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get placeholder() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/search.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/pages/search.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (36:12) {#if !dataset}
    function create_if_block_2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Cari Manga";
    			attr_dev(h1, "class", "text-center font-bold text-3xl pb-3");
    			add_location(h1, file$2, 36, 16, 1099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(36:12) {#if !dataset}",
    		ctx
    	});

    	return block;
    }

    // (44:16) <Button type="submit">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cari");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(44:16) <Button type=\\\"submit\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:12) {#if !dataset}
    function create_if_block_1(ctx) {
    	let div1;
    	let a0;
    	let t1;
    	let a1;
    	let div0;
    	let icngithub;
    	let t2;
    	let span;
    	let current;
    	icngithub = new Github({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "App by @keevnx";
    			t1 = space();
    			a1 = element("a");
    			div0 = element("div");
    			create_component(icngithub.$$.fragment);
    			t2 = space();
    			span = element("span");
    			span.textContent = "github.com/vnxx/mangaku";
    			attr_dev(a0, "class", "text-center text-sm block");
    			attr_dev(a0, "href", "https://www.instagram.com/keevnx/");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$2, 48, 20, 1554);
    			attr_dev(span, "class", "pl-2");
    			add_location(span, file$2, 60, 28, 2121);
    			attr_dev(div0, "class", "flex items-center justify-center");
    			add_location(div0, file$2, 58, 24, 2004);
    			attr_dev(a1, "class", "text-center text-sm block fill-current");
    			attr_dev(a1, "href", "https://github.com/vnxx/mangaku/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$2, 53, 20, 1780);
    			attr_dev(div1, "class", "space-y-2 pt-3");
    			add_location(div1, file$2, 47, 16, 1505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t1);
    			append_dev(div1, a1);
    			append_dev(a1, div0);
    			mount_component(icngithub, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, span);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icngithub.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icngithub.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icngithub);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(47:12) {#if !dataset}",
    		ctx
    	});

    	return block;
    }

    // (68:4) {#if dataset}
    function create_if_block(ctx) {
    	let div;
    	let current;
    	let each_value = /*dataset*/ ctx[1].data;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid grid-cols-2 xl:grid-cols-5 gap-6 pt-6");
    			add_location(div, file$2, 68, 8, 2320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 2) {
    				each_value = /*dataset*/ ctx[1].data;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(68:4) {#if dataset}",
    		ctx
    	});

    	return block;
    }

    // (70:12) {#each dataset.data as data}
    function create_each_block$1(ctx) {
    	let mangaitem;
    	let current;

    	mangaitem = new MangaItem({
    			props: { data: /*data*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mangaitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mangaitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mangaitem_changes = {};
    			if (dirty & /*dataset*/ 2) mangaitem_changes.data = /*data*/ ctx[6];
    			mangaitem.$set(mangaitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mangaitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mangaitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mangaitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(70:12) {#each dataset.data as data}",
    		ctx
    	});

    	return block;
    }

    // (29:0) <Layout spaceY="0" myClass={dataset ? "min-h-screen" : null}>
    function create_default_slot$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let form;
    	let input;
    	let updating_value;
    	let t1;
    	let button;
    	let t2;
    	let div1_class_value;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = !/*dataset*/ ctx[1] && create_if_block_2(ctx);

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[4](value);
    	}

    	let input_props = { placeholder: "hataraku maou sama!" };

    	if (/*search*/ ctx[0] !== void 0) {
    		input_props.value = /*search*/ ctx[0];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));

    	button = new Button({
    			props: {
    				type: "submit",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = !/*dataset*/ ctx[1] && create_if_block_1(ctx);
    	let if_block2 = /*dataset*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			form = element("form");
    			create_component(input.$$.fragment);
    			t1 = space();
    			create_component(button.$$.fragment);
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(form, "class", "space-y-3");
    			add_location(form, file$2, 38, 12, 1193);
    			attr_dev(div0, "class", "space-y-3 w-full xl:w-1/2 m-auto");
    			add_location(div0, file$2, 34, 8, 1009);

    			attr_dev(div1, "class", div1_class_value = `${/*dataset*/ ctx[1]
			? "block"
			: "absolute z-0 min-h-screen"} z-0 top-0 w-full xl:max-w-5xl px-3 left-0 flex`);

    			add_location(div1, file$2, 29, 4, 852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, form);
    			mount_component(input, form, null);
    			append_dev(form, t1);
    			mount_component(button, form, null);
    			append_dev(div0, t2);
    			if (if_block1) if_block1.m(div0, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[5]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!/*dataset*/ ctx[1]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const input_changes = {};

    			if (!updating_value && dirty & /*search*/ 1) {
    				updating_value = true;
    				input_changes.value = /*search*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!/*dataset*/ ctx[1]) {
    				if (if_block1) {
    					if (dirty & /*dataset*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*dataset*/ 2 && div1_class_value !== (div1_class_value = `${/*dataset*/ ctx[1]
			? "block"
			: "absolute z-0 min-h-screen"} z-0 top-0 w-full xl:max-w-5xl px-3 left-0 flex`)) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*dataset*/ ctx[1]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*dataset*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			destroy_component(input);
    			destroy_component(button);
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(29:0) <Layout spaceY=\\\"0\\\" myClass={dataset ? \\\"min-h-screen\\\" : null}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let loading_1;
    	let t;
    	let layout;
    	let current;

    	loading_1 = new Loading({
    			props: { isLoading: /*loading*/ ctx[2] },
    			$$inline: true
    		});

    	layout = new Layout({
    			props: {
    				spaceY: "0",
    				myClass: /*dataset*/ ctx[1] ? "min-h-screen" : null,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    			t = space();
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const loading_1_changes = {};
    			if (dirty & /*loading*/ 4) loading_1_changes.isLoading = /*loading*/ ctx[2];
    			loading_1.$set(loading_1_changes);
    			const layout_changes = {};
    			if (dirty & /*dataset*/ 2) layout_changes.myClass = /*dataset*/ ctx[1] ? "min-h-screen" : null;

    			if (dirty & /*$$scope, dataset, search*/ 515) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Search", slots, []);
    	let search = "";
    	let dataset;
    	let loading = false;

    	async function searchData() {
    		$$invalidate(2, loading = true);

    		if (search !== "") {
    			await fetch(`/api/manga/search?search=${search}`).then(r => r.json()).then(data => {
    				$$invalidate(1, dataset = data);
    				$$invalidate(2, loading = false);
    			});
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input_value_binding(value) {
    		search = value;
    		$$invalidate(0, search);
    	}

    	const submit_handler = () => searchData();

    	$$self.$capture_state = () => ({
    		Layout,
    		MangaItem,
    		IcnGitHub: Github,
    		Button,
    		Input,
    		Loading,
    		search,
    		dataset,
    		loading,
    		searchData
    	});

    	$$self.$inject_state = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("dataset" in $$props) $$invalidate(1, dataset = $$props.dataset);
    		if ("loading" in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [search, dataset, loading, searchData, input_value_binding, submit_handler];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/favorite.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/pages/favorite.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (17:8) {#each dataset as data}
    function create_each_block(ctx) {
    	let mangaitem;
    	let current;

    	mangaitem = new MangaItem({
    			props: { data: /*data*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mangaitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mangaitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mangaitem_changes = {};
    			if (dirty & /*dataset*/ 1) mangaitem_changes.data = /*data*/ ctx[1];
    			mangaitem.$set(mangaitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mangaitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mangaitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mangaitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:8) {#each dataset as data}",
    		ctx
    	});

    	return block;
    }

    // (14:0) <Layout>
    function create_default_slot(ctx) {
    	let h1;
    	let t1;
    	let div;
    	let current;
    	let each_value = /*dataset*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Favorites";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "font-bold text-2xl");
    			add_location(h1, file$1, 14, 4, 384);
    			attr_dev(div, "class", "grid grid-cols-2 xl:grid-cols-5 gap-6");
    			add_location(div, file$1, 15, 4, 434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dataset*/ 1) {
    				each_value = /*dataset*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(14:0) <Layout>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layout_changes = {};

    			if (dirty & /*$$scope, dataset*/ 17) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Favorite", slots, []);
    	let dataset = [];

    	onMount(() => {
    		let favorites = JSON.parse(localStorage.getItem("favorites"));
    		favorites = favorites ? favorites : [];
    		$$invalidate(0, dataset = favorites);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Favorite> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Layout, MangaItem, onMount, dataset });

    	$$self.$inject_state = $$props => {
    		if ("dataset" in $$props) $$invalidate(0, dataset = $$props.dataset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dataset];
    }

    class Favorite extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Favorite",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				routes: {
    					"/": Home,
    					"/manga/search": Search,
    					"/manga/favorites": Favorite,
    					"/manga/:slug": Manga,
    					"/manga/:slug/:chapter": ReadManga
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			add_location(main, file, 9, 0, 290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Manga,
    		Home,
    		ReadManga,
    		Search,
    		Favorite
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
