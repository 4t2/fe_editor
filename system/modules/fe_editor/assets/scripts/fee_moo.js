/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @since 		2013-01-15
 * @version 	1.2.0
 *
 * This package requires
 * - MooTools 1.4 >
 * - MooTools More Assets
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2013 Lingo4you, <http://www.lingolia.com/>
 *
 */

 window.addEvent('domready', function()
 {
 
 (function($) {
 
 	feeToolbar = new Element('div',
 	{
 		'id' : 'fee_toolbar',
 		'class' : 'no-sc fee_toolbar',
 		'html' : '<p id="fee_statusbar"></p>'
 	});
 
 	feeToolbarList = new Element('ul');
 	 	
 	//feeToolbarList.inject(feeToolbar, 'top');
 	
 	feeToolbarList.adopt(
	 	new Element('li',
	 	{
	 		'id' : 'fee_content_edit_item',
	 		'html' : '<a id="fee_content_edit" class="cerabox-content" href=""><img src="system/modules/fe_editor/assets/images/pencil.png" width="16" height="16" alt="c"></a>'
	 	}),
	 	new Element('li',
	 	{
	 		'id' : 'fee_article_edit_item',
	 		'html' : '<a id="fee_article_edit" class="cerabox" href=""><img src="system/modules/fe_editor/assets/images/page_white_edit.png" width="16" height="16" alt="c"></a>'
	 	}),
	 	new Element('li',
	 	{
	 		'id' : 'fee_page_edit_item',
	 		'html' : '<a id="fee_page_edit" class="cerabox" href=""><img src="system/modules/fe_editor/assets/images/page_edit.png" width="16" height="16" alt="c"></a>'
	 	}),
	 	new Element('li',
	 	{
	 		'id' : 'fee_news_edit_item',
	 		'html' : '<a id="fee_news_edit" class="cerabox" href=""><img src="system/modules/fe_editor/assets/images/script_edit.png" width="16" height="16" alt="c"></a>',
	 		'styles' : {
	 			'display' : 'none'
	 		}
	 	}),
	 	
	 	new Element('li',
	 	{
	 		'id' : 'fee_content_add_item',
	 		'html' : '<a id="fee_content_add" class="cerabox-content" href=""><img src="system/modules/fe_editor/assets/images/pencil_add.png" width="16" height="16" alt="c"></a>',
	 		'styles' : {
	 			'display' : 'none'
	 		}
	 	})
	 );

 	feeToolbar.grab(feeToolbarList, 'top');

	feeSettings = new Element('div',
	{
		'id' : 'fee_settings'
	});

	$(document.body).grab(feeSettings, 'bottom');
	
	$(document.body).grab(feeToolbar, 'bottom');

	feeSettings.setState = function(checked, flash)
	{
		this.setStyle('background-image', 'url(system/modules/fe_editor/assets/images/application'+(checked==1?'_edit.png':'.png')+')');
		this.store('checked', checked);

		Cookie.write('fee_checked', checked);

		if (checked == 1)
		{
			$$('.fe_editor').addClass('fee_editable');
			
			$$('.fe_editor').addEvent('mouseenter', function(e)
			{
				data = JSON.parse(this.get('data-fee'));

				$(this).grab(feeToolbar, 'top');

				if (data.content != undefined)
				{
					$('fee_content_edit').set('href', 'contao/main.php?do='+data.table+'&table=tl_content&act=edit&fee=1&rt='+data.rt+'&id='+data.content);
					$('fee_content_edit').set('data-statusbar', data.contentTitle);
					
					$('fee_content_add').set('href', 'contao/main.php?do='+data.table+'&table=tl_content&act=create&fee=1&mode=1&pid='+data.content+'&id='+data.article+'&rt='+data.rt);
					$('fee_content_add').set('data-statusbar', data.contentAddTitle);
					
					$('fee_content_add_item').setStyle('display', 'inline-block');
					$('fee_news_edit_item').setStyle('display', 'none');
					
					$('fee_statusbar').set('text', data.contentTitle);
				}
				else if (data.news != undefined)
				{
					$('fee_content_edit').set('href', 'contao/main.php?do=news&table=tl_news&act=edit&fee=1&rt='+data.rt+'&id='+data.news);
					$('fee_content_edit').set('data-statusbar', data.newsTitle);
					
					$('fee_news_edit').set('href', 'contao/main.php?do=news&table=tl_news&id='+data.newsArchive+'&rt='+data.rt);
					$('fee_news_edit').set('data-statusbar', data.newsArchiveTitle);

					$('fee_content_add_item').setStyle('display', 'none');
					$('fee_news_edit_item').setStyle('display', 'inline-block');
					
					$('fee_statusbar').set('text', data.newsTitle);
				}

				$('fee_article_edit').set('href', 'contao/main.php?do=article&table=tl_content&rt='+data.rt+'&id='+data.article);
				$('fee_article_edit').set('data-statusbar', data.articleTitle);
				
				$('fee_page_edit').set('href', 'contao/main.php?do=page&act=edit&rt='+data.rt+'&id='+data.page);
				$('fee_page_edit').set('data-statusbar', data.pageTitle);
				
				if (this.getCoordinates().top < 35)
				{
					feeToolbar.setStyle('margin-top', '0');
				}
			});

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


	feePreview = new Element('div',
	{
		'id' : 'fee_preview'
	});

	feePreview.setStyle('background-image', 'url(system/modules/fe_editor/assets/images/lightbulb'+(Cookie.read('FE_PREVIEW')==1?'.png':'_off.png')+')');

	$(document.body).grab(feePreview, 'bottom');

	feePreview.addEvent('click', function(e)
	{
		if (Cookie.read('FE_PREVIEW') == 1)
		{
			Cookie.write('FE_PREVIEW', '');
		}
		else
		{
			Cookie.write('FE_PREVIEW', '1');
		}

		document.location.reload();
	});


	reloadOnClose = false;
	bodyPosition = 'relative';
	bodyTop = 0;

	if (!Browser.Platform.ios && !Browser.Platform.android && !Browser.Platform.webos)
	{
		$$('a.cerabox').cerabox({
			width: '980px',
			height: $(window).getSize().y+'px',
			group: false,
			fixedPosition: true,
			animation: 'ease',
			loaderAtItem: true,
			clickToClose: false,
			clickToCloseOverlay: false,
			events: {
				onOpen: function(e) {
					bodyTop = $(document.body).getScroll().y;
					bodyPosition = $(document.body).getStyle('position');
					$(document.body).setStyle('position', 'fixed');
					reloadOnClose = false;
				},
				onChange: function(src) {
					reloadOnClose = true;
				},
				onClose: function(e) {
					$(document.body).setStyle('position', bodyPosition);
					$(document.body).scrollTo(0, bodyTop);

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
			fixedPosition: true,
			animation: 'ease',
			loaderAtItem: true,
			clickToCloseOverlay: false,
			events: {
				onOpen: function()
				{
					bodyTop = $(document.body).getScroll().y;
					bodyPosition = $(document.body).getStyle('position');
					$(document.body).setStyle('position', 'fixed');
					reloadOnClose = false;

					try
					{
						iframe = $('cerabox').getElement('iframe').contentWindow;
						boxSrc = iframe.document.location.href;
					}
					catch (err)	{}
				},
				onChange: function()
				{
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
				onClose: function(e)
				{
					$(document.body).setStyle('position', bodyPosition);
					$(document.body).scrollTo(0, bodyTop);

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
/*
	$$('.fee_toolbar').getParent()
		.addEvent('mouseenter', function(e) {
			if (this.getCoordinates().top < 35)
			{
				this.getElement('.fee_toolbar').setStyle('margin-top', '0');
			}
		});
*/

	$$('#fee_toolbar a')
		.addEvent('mouseenter', function(e) {
			//this.getParent('div').getChildren('p').set('text', this.get('title'));
			//this.set('title', '');
			$('fee_statusbar').set('text', this.get('data-statusbar'));
		})
		.addEvent('mouseleave', function(e) {
			//this.set('title', this.getParent('div').getChildren('p')[0].get('text'));
			//$('fee_statusbar').set('text', 'FrontendEditor');
		});

	$('fee_content_edit')
		.addEvent('mouseenter', function(e) {
			this.getParent('.fe_editor')
				.setStyle('outline-color', 'red');
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});
	
	$('fee_content_add')
		.addEvent('mouseenter', function(e) {
			this.getParent('.fe_editor')
				.setStyle('outline-color', 'green');
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});

	$('fee_article_edit')
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

	$('fee_page_edit')
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

})(document.id);

});