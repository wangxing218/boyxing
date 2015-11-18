/**
 * ui-select美化插件
 * 基于jQuery
 */
; + function($) {
    'use strict';
    // 默认实例化配置
    var defaults = {
        width: null, //select的宽度，默认为null将自动获取select的宽度；
        wrapClass: '', //加载在最外层.ui-select-wrap有class，在自定义样式时有用处；
        dataKey: 'ui-select', //实例化后对象存在select的data键值，方便后续通过data('ui-select')取出；
        onChange: null, //select值改变时的回调；
        onClick: null //select元素点击时的回调，diabled时不发生。
    };
    /**
     * ui-select插件
     */
    $.fn.ui_select = function(options) {
        var _this = $(this),
            _counts = _this.length;

        // 当要实例的对象只有一个时，直接实例化返回对象；
        if (_counts === 1) {
            return new UI_select(_this, options);
        };
        // 当要实例的对象有多个时，循环实例化，不返回对象；
        if (_this.length) {
            _this.each(function(index, el) {
                new UI_select($(el), options);
            })
        }
        // 当元素个数为0时，不执行实例化。
    };

    /**
     * UI_select对象
     * @param {[jQuery]} el  [jQuery选择后的对象，此处传入的为单个元素]
     * @param {[object]} opt [设置的参数]
     */
    function UI_select(el, opt) {
        this.el = el;
        this._opt = $.extend({}, defaults, opt);
        this._doc = $(document);
        this._win = $(window);
        return this._init();
    }
    UI_select.prototype = {
        // init初始化;
        _init: function() {
            var _data = this.el.data(this._opt.dataKey);
            // 如果已经实例化了，则直接返回
            if (_data)
                return _data;
            else
                this.el.data(this._opt.dataKey, this);
            this._setHtml(); // 组建元素
            this._bindEvent(); // 绑定事件
        },
        // 组建并获取相关的dom元素;
        _setHtml: function() {
            this.el.wrap('<div tabindex="0" class="ui-select-wrap ' + this._opt.wrapClass + '"></div>')
                .after('<div class="ui-select-input"></div><i class="ui-select-arrow"></i><ul class="ui-select-list"></ul>');
            var _w = this._opt.width ? this._opt.width - 17 : this.el.outerWidth() - 17;
            this._wrap = this.el.parent('.ui-select-wrap').css('width', _w);
            this._input = this.el.next('.ui-select-input');
            this._list = this._wrap.children('.ui-select-list');
            this.el.prop('disabled') ? this.disable() : null;
            var _ohtml = '';
            this.el.find('option').each(function(index, el) {
                var _this = $(el),
                    _text = _this.text(),
                    _value = _this.prop('value'),
                    _selected = _this.prop('selected') ? 'selected' : '',
                    _disabled = _this.prop('disabled') ? ' disabled' : '';
                _ohtml += '<li title="' + _text + '" data-value="' + _value + '" class="' + _selected + _disabled + '">' + _text + '</li> ';
            });
            this._list.html(_ohtml);
            this._items = this._list.children('li');
            this.val(this.el.val());

            var _txt = this._list.children('li.selected').text();
            this._input.text(_txt).attr('title', _txt);
        },
        // 绑定事件；
        _bindEvent: function() {
            var _this = this;
            // 列表元素点击事件；
            _this._items.on('click', function(e) {
                var _self = $(this),
                    _val = _self.attr('data-value'),
                    _onChange = !_self.hasClass('selected');
                if (_self.hasClass('disabled'))
                    return;
                _this.val(_val);
                if (_onChange) {
                    _this._changeBack(_val, _self);
                }
                _this._clickBack(_val, _self);
            });
            // 模拟后的select点击事件；
            _this._wrap.on('click', function(event) {
                if (_this._disabled)
                    return;
                event.stopPropagation();
                var _lists = $('.ui-select-list');
                _this._doc.one('click', function() {
                    _lists.hide();
                })
                _lists.not(_this._list).hide();
                _this._list.toggle();
            });
            return _this;
        },
        // change 触发；
        _changeBack: function(value, item) {
            this.el.change();
            this.onChange(value, item);
            if (typeof this._opt.onChange == 'function')
                this._opt.onChange.call(this, value, item);
        },

        // click 触发；
        _clickBack: function(value, item) {
            this.onClick(value, item);
            if (typeof this._opt.onClick == 'function')
                this._opt.onClick.call(this, value, item);
        },

        // 获取或设置值；
        val: function(value) {
            if (value === undefined)
                return this.el.val();
            this.el.val(value);
            var _selectedLi = this._list.children('li[data-value="' + value + '"]');
            _selectedLi.addClass('selected').siblings('li').removeClass('selected');
            this._input.html(_selectedLi.text()).attr('title', _selectedLi.text());;
        },

        // 值改变事件；
        onChange: function(value, item) {},
        // 点击事件；
        onClick: function(value, item) {},

        // 禁用select；
        disable: function() {
            this._disabled = true;
            this._wrap.addClass('disabled');
            return this;
        },
        // 启用select；
        enable: function() {
            this._disabled = false;
            this._wrap.removeClass('disabled');
            return this;
        }
    };
}(jQuery);