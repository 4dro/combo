define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dojo/on',
	'dojo/keys'
], function(declare, _WidgetBase, on, keys){
return declare([_WidgetBase], {

	popup: null,
	dataProvider: null,
	labelField: 'label',
	prompt: '',
	selectedIndex: -1,
	selectedItem: null,
	htmlItems: false,

	_popupActive: false,
	_textNode: null,

// ************************** Construction **********************************************
	buildRendering: function()
	{
		this.dataProvider = this.dataProvider || [];
		this.domNode = this.ownerDocument.createElement('div');
		this.domNode.className = 'cbInput';
		if (this.srcNodeRef)	// handle existing html select
		{

		}
		var bar = this.ownerDocument.createElement('div');
		bar.className = 'cbTextBar';
		this.domNode.appendChild(bar);
		this._textNode = document.createElement('div');
		bar.appendChild(this._textNode);
		this._textNode.textContent = this.prompt;

		var pop = this.ownerDocument.createElement('div');
		pop.className = 'cbIconBar';
		this.domNode.appendChild(pop);
		var popupIcon = this.ownerDocument.createElement('span');
		popupIcon.className = 'cbPopupIcon';
		pop.appendChild(popupIcon);

		this.inherited(arguments);
		if (!this.domNode.getAttribute('tabindex'))
		{
			this.domNode.setAttribute('tabindex', '0');
		}
		var self = this;
		this.own(on(this.domNode, 'click', function(e){
			if (self._popupActive)
			{
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
			else if (e.keyCode == keys.UP_ARROW)
			{

			}
			else if (e.keyCode == keys.DOWN_ARROW)
			{

			}
		}));
	},

// ********************** Exported functions ************************************************
	setDataProvider: function(dp)
	{
		this.dataProvider = dp;
		if (this._popupActive)
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

	setSelectedIndex: function(value)
	{
		if (this.selectedIndex == value)
		{
			return;
		}
		this.selectedIndex = value;
		if (value == -1)
		{
			this._textNode.textContent = this.prompt;
		}
		else
		{
			this._textNode.textContent = this.getItemLabel(this.dataProvider[value]);
		}
	},

// ******************************** Internal functions **********************************************
	showPopup: function()
	{
		if (!this.popup)
		{
			this.popup = this.ownerDocument.createElement('div');
			this.popup.className = 'cbPopup';
			this.own(on(this.popup, 'click', function(e){

			}));
			this.ownerDocument.body.appendChild(this.popup);
		}
		var list = this.ownerDocument.createElement('ul');
		for (var i = 0; i < this.dataProvider.length; i++)
		{
			var opt = this.ownerDocument.createElement('li');
			opt.innerHTML = this.getItemLabel(this.dataProvider[i]);
			list.appendChild(opt);
		}
		this._popupActive = true;
		this.popup.appendChild(list);
	},

	closePopup: function()
	{
		if (!this.popup)
		{
			return;
		}
		this.popup.style.display = 'none';	// TODO: remove popup completely
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

// ****************** User events *********************************************************
	popupClicked: function()
	{

	},

// **************************** Notifications *********************************************
	onChange: function(){}
});
});