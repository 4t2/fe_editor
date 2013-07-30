/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @version 	2.0.0
 *
 * This package requires
 * - MooTools 1.4 >
 * - MooTools More Assets
 * - Cerabox
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2013 Lingo4you, <http://www.lingolia.com/>
 *
 */

(function($)
{
	window.addEvent('domready', function()
	{
	 	feeToolbar = new Element('div',
	 	{
	 		'id' : 'fee_toolbar',
	 		'class' : 'no-sc fee_toolbar',
	 		'html' : '<p id="fee_statusbar"></p>'
	 	});
	 
	 	feeToolbarList = new Element('ul');
	 	 	
	 	feeToolbarList.adopt(
		 	new Element('li',
		 	{
		 		'id' : 'fee_content_edit_item',
		 		'html' : '<a id="fee_content_edit" class="cerabox" data-mediabox="content" href=""><img src="system/modules/frontend_editor/assets/images/pencil.png" width="16" height="16" alt="c"></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_article_edit_item',
		 		'html' : '<a id="fee_article_edit" class="cerabox" href=""><img src="system/modules/frontend_editor/assets/images/page_white_edit.png" width="16" height="16" alt="c"></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_page_edit_item',
		 		'html' : '<a id="fee_page_edit" class="cerabox" href=""><img src="system/modules/frontend_editor/assets/images/page_edit.png" width="16" height="16" alt="c"></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_news_edit_item',
		 		'html' : '<a id="fee_news_edit" class="cerabox" href=""><img src="system/modules/frontend_editor/assets/images/script_edit.png" width="16" height="16" alt="c"></a>',
		 		'styles' : {
		 			'display' : 'none'
		 		}
		 	}),
		 	
		 	new Element('li',
		 	{
		 		'id' : 'fee_content_add_item',
		 		'html' : '<a id="fee_content_add" class="cerabox" data-mediabox="content" href=""><img src="system/modules/frontend_editor/assets/images/pencil_add.png" width="16" height="16" alt="c"></a>',
		 		'styles' : {
		 			'display' : 'none'
		 		}
		 	})
		 );
	
	 	feeToolbar.grab(feeToolbarList, 'top');


		/**
		 * Create settings button
		 */
		var feeSettings = new Element('div',
		{
			'id' : 'fee_settings',
			'html' : '<a accesskey="e"></a>'
		});
	
		$(document.body).grab(feeSettings, 'bottom');

		$(document.body).grab(feeToolbar, 'bottom');

		var feeActive = undefined;

		feeSettings.setState = function(checked, flash)
		{
			this.setStyle('background-image', 'url(system/modules/frontend_editor/assets/images/application'+(checked==1?'_edit.png':'.png')+')');
			this.store('checked', checked);

			Cookie.write('fee_checked', checked);

			if (checked == 1)
			{
				$$('.fe_editor').addClass('fee_editable');
				
				$$('.fe_editor').addEvent('mouseenter', function(e)
				{
					data = JSON.parse(this.get('data-fee'));
	
//					$(this).grab(feeToolbar, 'top');
	
					if (data.content != undefined)
					{
						if (data.contentTitle != undefined)
						{
							$('fee_content_edit').set('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=edit&fee=1&rt='+data.rt+'&id='+data.content);
							$('fee_content_edit').set('data-statusbar', data.contentTitle);

							$('fee_statusbar').set('text', data.contentTitle);
						}
						else
						{
							$('fee_content_edit_item').setStyle('display', 'none');
						}

						if (data.contentAddTitle != undefined)
						{
							$('fee_content_add').set('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=create&fee=1&mode=1&pid='+data.content+'&id='+data.article+'&rt='+data.rt);
							$('fee_content_add').set('data-statusbar', data.contentAddTitle);
							$('fee_content_add_item').setStyle('display', 'inline-block');
						}
						else
						{
							$('fee_content_add_item').setStyle('display', 'none');
						}
						
						$('fee_news_edit_item').setStyle('display', 'none');	
					}
					else if (data.news != undefined)
					{
						if (data.newsTitle != undefined)
						{
							$('fee_content_edit').set('href', 'contao/main.php?do=news&table=tl_news&act=edit&fee=1&rt='+data.rt+'&id='+data.news);
							$('fee_content_edit').set('data-statusbar', data.newsTitle);
							$('fee_news_edit').set('href', 'contao/main.php?do=news&table=tl_news&id='+data.newsArchive+'&rt='+data.rt);
							$('fee_news_edit').set('data-statusbar', data.newsArchiveTitle);

							$('fee_news_edit_item').setStyle('display', 'inline-block');
							
							$('fee_statusbar').set('text', data.newsTitle);
						}
						else
						{
							$('fee_content_edit_item').setStyle('display', 'none');
							$('fee_news_edit_item').setStyle('display', 'none');
						}
	
						$('fee_content_add_item').setStyle('display', 'none');
					}

					if (data.articleTitle != undefined)
					{
						$('fee_article_edit').set('href', 'contao/main.php?do=article&table=tl_content&rt='+data.rt+'&id='+data.article);
						$('fee_article_edit').set('data-statusbar', data.articleTitle);
					}
					else
					{
						$('fee_article_edit_item').setStyle('display', 'none');
					}

					if (data.pageTitle != undefined)
					{
						$('fee_page_edit').set('href', 'contao/main.php?do=page&act=edit&rt='+data.rt+'&id='+data.page);
						$('fee_page_edit').set('data-statusbar', data.pageTitle);
					}
					else
					{
						$('fee_page_edit_item').setStyle('display', 'none');
					}

					offset = this.getPosition();

					$('fee_toolbar').setPosition({ x: offset.x, y: (offset.y > 32 ? offset.y-32 : offset.y)});
					
					feeToolbar.setStyle('visibility', 'visible');
					
					feeActive = this;

					if (this.getCoordinates().top < 35)
					{
//						feeToolbar.setStyle('margin-top', '0');
					}
				});

				$$('.fe_editor').addEvent('mouseleave', function(e)
				{
					feeToolbar.setStyle('visibility', 'hidden');
				});


				feeToolbar.addEvent('mouseenter', function(e)
				{
					feeToolbar.setStyle('visibility', 'visible');

					if (feeActive != undefined)
					{
						feeActive.addClass('fee_flash');
					}
				});

				feeToolbar.addEvent('mouseleave', function(e)
				{
					feeToolbar.setStyle('visibility', 'hidden');

					if (feeActive != undefined)
					{
						feeActive.removeClass('fee_flash');
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
				$$('.fe_editor').removeEvents('mouseenter');
				$$('.fe_editor').removeEvents('mouseleave');
			}
		};
	
		state = Cookie.read('fee_checked');

		feeSettings.setState((state=='null' ? 0 : state), false);
	
		feeSettings.addEvent('click', function(e)
		{
			this.setState((this.retrieve('checked')==1 ? 0 : 1), true);
		});
	

		/**
		 * Create frontend preview button
		 */
		var feePreview = new Element('div',
		{
			'id' : 'fee_preview',
			'html' : '<a accesskey="p"></a>'
		});
	
		feePreview.setStyle('background-image', 'url(system/modules/frontend_editor/assets/images/lightbulb'+(Cookie.read('FE_PREVIEW')==1?'.png':'_off.png')+')');
	
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
			contentLink = false;

			onLoadContaoBackend = function(href, reload)
			{
				if (contentLink == false)
				{
					contentLink = href;
				}
				else if (contentLink != href)
				{
					CeraBoxWindow.close();

					if (reload)
					{
						window.location.reload();
					}
				}
			};


			$$('a.cerabox').cerabox({
//				width: '980px',
				width: function()
				{
					if ($$(el).get('data-mediabox') == 'content')
					{
						return '750px';
					}
					else
					{
						return '980px';
					}
				},
				//height: $(window).getSize().y+'px',
				height: '100%',
				group: false,
				fixedPosition: true,
				animation: 'ease',
				loaderAtItem: true,
				clickToClose: false,
				clickToCloseOverlay: false,
				preventScrolling: true,
				displayTitle: false,
				events:
				{
					onOpen: function(el)
					{
						bodyTop = $(document.body).getScroll().y;
						bodyPosition = $(document.body).getStyle('position');
						
						$(document.body).setStyle('position', 'fixed');

						reloadOnClose = false;

						if ($$(el).get('data-mediabox') == 'content')
						{
							window.onLoadContaoBackend = onLoadContaoBackend;
						}
						else
						{
							window.onLoadContaoBackend = function(href, reload) {};
						}
					},
					onClose: function(el)
					{
						$(document.body).setStyle('position', bodyPosition);
						$(document.body).scrollTo(0, bodyTop);
					}
				}
			});
		}
		else
		{
			$$('a.cerabox').set('target', '_blank');
		}


		$$('#fee_toolbar a')
			.addEvent('mouseenter', function(e)
			{
				$('fee_statusbar').set('text', this.get('data-statusbar'));
			});

		$('fee_content_edit')
			.addEvent('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.setStyle('outline-color', 'red');
				}
			})
			.addEvent('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.setStyle('outline-color', 'black');
				}
			});

		$('fee_content_add')
			.addEvent('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.setStyle('outline-color', 'green');
				}
			})
			.addEvent('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.setStyle('outline-color', 'black');
				}
			});
	
		$('fee_article_edit')
			.addEvent('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.getParent('.mod_article')
						.setStyles({
							'outline': '2px dotted red',
							'outline-offset': '-2px'
						});
				}
			})
			.addEvent('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.getParent('.mod_article').setStyle('outline', 'none');
				}
			});
	
		$('fee_page_edit')
			.addEvent('mouseenter', function(e)
			{
				$(document.body)
					.setStyles({
						'outline': '5px dotted red',
						'outline-offset': '-5px'
					});
			})
			.addEvent('mouseleave', function(e)
			{
				$(document.body).setStyle('outline', 'none');
			});

	});
})(document.id);
