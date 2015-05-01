define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/on',
	'dojo/keys'
], function(declare, _WidgetBase, on, keys){
return declare([_WidgetBase], {

	dataProvider: null,
	labelField: 'label',
	prompt: '',
	_selectedIndex: -1,
	htmlItems: false,
	maxHeight: '300px',

	// dom nodes
	popup: null,
	_popupListener: null,
	_textNode: null,
	_mainNode: null,

// ************************** Construction **********************************************
	buildRendering: function()
	{
		this.dataProvider = this.dataProvider || [];
		this.domNode = this.ownerDocument.createElement('div');
		this.domNode.className = 'cbInput';

		this._mainNode = this.ownerDocument.createElement('div');
		this._mainNode.className = "cbBar";

		var bar = this.ownerDocument.createElement('div');
		bar.className = 'cbTextBar';
		this._textNode = document.createElement('div');
		this._textNode.textContent = this.prompt;
		bar.appendChild(this._textNode);
		this._mainNode.appendChild(bar);

		var pop = this.ownerDocument.createElement('div');
		pop.className = 'cbIconBar';
		this._mainNode.appendChild(pop);
		var popupIcon = this.ownerDocument.createElement('span');
		popupIcon.className = 'cbPopupIcon';
		pop.appendChild(popupIcon);
		this.domNode.appendChild(this._mainNode);

		if (this.srcNodeRef)	// handle existing html select
		{
			if (this.srcNodeRef.localName == 'select')
			{
				var opts = this.srcNodeRef.getElementsByTagName('option');
				var dp = [];
				for (var i = 0; i < opts.length; i++)
				{
					var option = {};
					var label = opts[i].getAttribute('label');
					option.label = label;
					dp.push(option);
				}
				this.setDataProvider(dp);
			}
		}

		this.inherited(arguments);
		if (!this.domNode.getAttribute('tabindex'))
		{
			this.domNode.setAttribute('tabindex', '0');
		}
		var self = this;
		this.own(on(this.domNode, 'blur', function(e){
			if (self.popup)
			{
				self.closePopup();
			}
		}));
		this.own(on(this.domNode, 'click', function(e){
			if (self.popup)
			{
				var item = e.target;
				if (item.localName == 'li')
				{
					self.setSelectedIndex(item.getAttribute('data-idx'));
					self.onChange();
				}
				self.closePopup();
			}
			else
			{
				self.showPopup();
			}
		}));
		this.own(on(this.domNode, 'keydown', function(e){
			if (e.keyCode == keys.SPACE)
			{
				self.showPopup();
			}
			else if (e.keyCode == keys.ESCAPE)
			{
				if (self.popup)
				{
					self.closePopup();
				}
			}
			else if (e.keyCode == keys.UP_ARROW)
			{
				if (self.popup)
				{

				}
				else
				{

				}
			}
			else if (e.keyCode == keys.DOWN_ARROW)
			{
				if (self.popup)
				{

				}
				else
				{

				}
			}
		}));
	},

// ********************** Exported functions ************************************************
	setDataProvider: function(dp)
	{
		this.dataProvider = dp;
		if (this.popup)
		{
			this.closePopup();
		}
		if (this.prompt || !dp.length)
		{
			this.setSelectedIndex(-1);
		}
		else
		{
			this.setSelectedIndex(0);
		}
	},

	getSelectedIndex: function()
	{
		return this._selectedIndex;
	},

	setSelectedIndex: function(value)
	{
		value = parseInt(value);
		if (this._selectedIndex == value)
		{
			return;
		}
		this._selectedIndex = value;
		if (value == -1)
		{
			this._textNode.textContent = this.prompt;
		}
		else
		{
			this._textNode.textContent = this.getItemLabel(this.dataProvider[value]);
		}
	},

	getSelectedItem: function()
	{
		if (this._selectedIndex == -1)
		{
			return null;
		}
		return this.dataProvider[this._selectedIndex];
	},

// ******************************** Internal functions **********************************************
	showPopup: function()
	{
		if (this.popup)
		{
			throw new Error('popup already exists')
		}
		this.popup = this.ownerDocument.createElement('div');
		this.popup.className = 'cbPopup';
		var self = this;
		this._popupListener = on(this.popup, 'click', function(e){
			self.popupClicked(e);
		});
		this.domNode.appendChild(this.popup);

		var list = this.ownerDocument.createElement('ul');
		list.className = 'cbPopList';
		for (var i = 0; i < this.dataProvider.length; i++)
		{
			var opt = this.ownerDocument.createElement('li');
			opt.setAttribute('data-idx', i);
			if (i == this._selectedIndex)
			{
				opt.className = 'cbSelected';
			}
			opt.innerHTML = this.getItemLabel(this.dataProvider[i]);
			list.appendChild(opt);
		}
		this.popup.appendChild(list);
	},

	closePopup: function()
	{
		if (!this.popup)
		{
			throw new Error('popup doesnt exist')
		}
		this._popupListener.remove();
		this.domNode.removeChild(this.popup);
		this.popup = null;
	},

	getItemLabel: function(item)
	{
		var lbl = '';
		if (typeof item == 'string')
		{
			lbl = item;
		}
		else
		{
			lbl = item[this.labelField];
			if (typeof lbl == 'function')
			{
				lbl = lbl.apply(item);
			}
		}
		return lbl;
	},

	_setMaxHeightAttr: function(value)
	{
		this.maxHeight = value;
	},

// ****************** User events *********************************************************
	popupClicked: function()
	{

	},

// **************************** Notifications *********************************************
	onChange: function(){}
});
});