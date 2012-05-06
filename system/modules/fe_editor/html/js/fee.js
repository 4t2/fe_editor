/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @since 		2012-05-06
 * @version 	1.1.2
 *
 * This package requires
 * - MooTools 1.4 >
 * - MooTools More Assets
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2012 Lingo4you, <http://www.lingo4u.de/>
 *
 */
 
 window.addEvent('domready', function() {

	feeSettings = new Element('div',
	{
		'id' : 'fee_settings'
	});

	feeSettings.inject($(document.body), 'top');

	feeSettings.setState = function(checked, flash)
	{
		this.setStyle('background-image', 'url(system/modules/fe_editor/html/images/application'+(checked==1?'_edit.png':'.png')+')');
		this.store('checked', checked);

		Cookie.write('fee_checked', checked);

		if (checked==1)
		{
			$$('.fe_editor').addClass('fee_editable');

			if (flash)
			{
				$$('.fe_editor').addClass('fee_flash');

				setTimeout(function()
				{
					$$('.fe_editor').removeClass('fee_flash');
				}, 250);
			}
		}
		else
		{
			$$('.fe_editor').removeClass('fee_editable');
		}
	};

	state = Cookie.read('fee_checked');
	feeSettings.setState((state=='null'?0:state), false);

	feeSettings.addEvent('click', function(e)
	{
		this.setState((this.retrieve('checked')==1?0:1), true);
	});

	reloadOnClose = false;

	if (!Browser.Platform.ios && !Browser.Platform.android && !Browser.Platform.webos)
	{
		$$('a.cerabox').cerabox({
			width: '980px',
			height: $(window).getSize().y+'px',
			group: false,
			fixedPosition: false,
			animation: 'ease',
			events: {
				onOpen: function(e) {
					reloadOnClose = false;
				},
				onChange: function(src) {
					reloadOnClose = true;
				},
				onClose: function(e) {
					if (reloadOnClose)
					{
						window.location.reload();
					}
				}
			}
		});

		boxSrc = '';

		$$('a.cerabox-content').cerabox({
			width: '750px',
			height: $(window).getSize().y+'px',
			group: false,
			fixedPosition: false,
			animation: 'ease',
			events: {
				onOpen: function() {
					reloadOnClose = false;

					try
					{
						iframe = $('cerabox').getElement('iframe').contentWindow;
						boxSrc = iframe.document.location.href;
					}
					catch (err)	{}
				},
				onChange: function() {
					reloadOnClose = true;
					
					try
					{
						iframe = $('cerabox').getElement('iframe').contentWindow;
						
						if (iframe != undefined && boxSrc != iframe.document.location.href)
						{
							CeraBoxWindow.close();
						}
					}
					catch (err)	{}
				},
				onClose: function(e) {
					if (reloadOnClose)
					{
						window.location.reload();
					}
				}
			}
		});
	}
	else
	{
		$$('a.cerabox').set('target', '_blank');
	}

	$$('.fee_toolbar').getParent()
		.addEvent('mouseenter', function(e) {
			if (this.getCoordinates().top < 35)
			{
				this.getElement('.fee_toolbar').setStyle('margin-top', '0');
			}
		});

	$$('.fee_toolbar a')
		.addEvent('mouseenter', function(e) {
			this.getParent('div').getChildren('p').set('text', this.get('title'));
			this.set('title', '');
		})
		.addEvent('mouseleave', function(e) {
			this.set('title', this.getParent('div').getChildren('p')[0].get('text'));
		});
	
	$$('.fee_content_edit a')
		.addEvent('mouseenter', function(e) {
			this.getParent('.fe_editor')
				.setStyle('outline-color', 'red');
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});
	
	$$('.fee_content_add a')
		.addEvent('mouseenter', function(e) {
			this.getParent('.fe_editor')
				.setStyle('outline-color', 'green');
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});

	$$('.fee_article_edit a')
		.addEvent('mouseenter', function(e) {
			this.getParent('.mod_article')
				.setStyles({
					'outline': '2px dotted red',
					'outline-offset': '-2px'
				});
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.mod_article').setStyle('outline', 'none');
		});

	$$('.fee_page_edit a')
		.addEvent('mouseenter', function(e) {
			$(document.body)
				.setStyles({
					'outline': '5px dotted red',
					'outline-offset': '-5px'
				});
		})
		.addEvent('mouseleave', function(e) {
			$(document.body).setStyle('outline', 'none');
		});
});