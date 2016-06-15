/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @version 	2.2.3
 *
 * This package requires
 * - MooTools 1.4 >
 * - MooTools More Assets
 * - Cerabox
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2014 Lingo4you, <http://www.lingolia.com/>
 *
 */

feeDragInProgress = false;


(function($)
{
	window.addEvent('domready', function()
	{
		if (feeCookieDomain != '')
		{
			feeCookieSettings =
			{
				'domain' : feeCookieDomain
			};
		}
		else
		{
			feeCookieSettings = {};
		}

	 	feeToolbar = new Element('div',
	 	{
	 		'id' : 'fee_toolbar',
	 		'class' : 'no-sc fee_toolbar',
	 		'html' : '<p id="fee_statusbar"></p>'
	 	});

	 	feeToolbar.close = function()
	 	{
 			if (!feeDragInProgress)
			{
				this.setStyle('visibility', 'hidden');

				if (feeActive != undefined)
				{
					feeActive.removeClass('fee_flash');
				}
			}
	 	};
	 
	 	feeToolbarList = new Element('ul');

	 	feeToolbarList.adopt
	 	(
		 	new Element('li',
		 	{
		 		'id' : 'fee_content_edit_item',
		 		'html' : '<a id="fee_content_edit" class="cerabox" data-mediabox="content" href=""></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_article_edit_item',
		 		'html' : '<a id="fee_article_edit" class="cerabox" href=""></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_page_edit_item',
		 		'html' : '<a id="fee_page_edit" class="cerabox" href=""></a>'
		 	}),
		 	new Element('li',
		 	{
		 		'id' : 'fee_news_edit_item',
		 		'html' : '<a id="fee_news_edit" class="cerabox" href=""></a>',
		 		'styles' : {
		 			'display' : 'none'
		 		}
		 	}),
		 	
		 	new Element('li',
		 	{
		 		'id' : 'fee_content_add_item',
		 		'html' : '<a id="fee_content_add" class="cerabox" data-mediabox="content" href=""></a>',
		 		'styles' : {
		 			'display' : 'none'
		 		}
		 	})
/*
		 	new Element('li',
		 	{
		 		'id' : 'fee_drag_content_item',
		 		'html' : '<a id="fee_drag_content" href="" onclick="return false;"></a>'
		 	})
*/
		 );
	
	 	feeToolbar.grab(feeToolbarList, 'top');


		/**
		 * Create settings button
		 */
		var feeSettings = new Element('div',
		{
			'id' : 'fee_settings',
			'html' : '<a id="fee_settings_icon" accesskey="e"></a>'
		});
	
		$(document.body).grab(feeSettings, 'bottom');

		$(document.body).grab(feeToolbar, 'bottom');

		var feeActive = undefined;

		feeSettings.setState = function(checked, flash)
		{
			$('fee_settings_icon').setStyle('background-position', '0 '+(checked==1?'-32px':'0'));
			this.store('checked', checked);

			Cookie.write('fee_checked', checked, feeCookieSettings);

			if (checked == 1)
			{
				$$('.fe_editor').addClass('fee_editable');

				$$('.fe_editor').addEvent('mouseenter', function(e)
				{
					data = JSON.parse(this.get('data-fee'));
/*
					if (!feeDragInProgress)
					{
						$('fee_drag_content_item').set('data-fee', this.get('data-fee'));

						$('fee_drag_content_item').addEvent('mouseenter', function(e)
						{
							feeDragInProgress = true;

							$('fee_drag_content_item').makeDraggable(
							{
								droppables: $$('.fe_editor'),

								onEnter: function(draggable, droppable)
								{
									droppable.setStyle('outline', '2px dotted green');
								},
								onLeave: function(draggable, droppable)
								{
									droppable.setStyle('outline', 'none');
								},
								onDrop: function(draggable, droppable)
								{
									feeDragInProgress = false;

									if (droppable)
									{
										dragData = JSON.parse(draggable.get('data-fee'));

										dropData = JSON.parse(droppable.get('data-fee'));

										if (dragData.do == dragData.do && dragData.content != dropData.content)
										{
											if (confirm("Inhaltselement "+dragData.content+" an Stelle "+dropData.content+" verschieben?"))
											{
												var dragRequest = new Request(
												{
													method: 'get',
													url: 'contao/main.php',
													onSuccess: function(responseText, responseXML)
													{
														document.location.reload();
													}
												}).send('do='+dropData.do+'&table=tl_content&act=cut&mode=1&rt='+dropData.rt+'&id='+dragData.content+'&pid='+dropData.content);
											}
										}

										dropLink = draggable.getChildren('a')[0].href;
										dropLink = dropLink + '&pid=' + dropData.content;

										console.log(dropLink);
									}
									else
									{
										draggable.setStyle('background', '#C17878');
									}

									draggable.setStyle('display', 'inline-block');
									draggable.setStyle('position', 'static');
									draggable.setStyle('left', '0');
									draggable.setStyle('top', '0');

									document.location.reload();
								}
							});
						});
					}
*/

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

					$('fee_toolbar').setPosition({ x: offset.x, y: (offset.y > 44 ? offset.y-44 : offset.y)});
					
					feeToolbar.setStyle('visibility', 'visible');
					
					feeActive = this;

					if (this.getCoordinates().top < 35)
					{
//						feeToolbar.setStyle('margin-top', '0');
					}
				});

				$$('.fe_editor').addEvent('mouseleave', function(e)
				{
					if (!feeDragInProgress)
					{
						feeToolbar.setStyle('visibility', 'hidden');
					}
				});


				feeToolbar.addEvent('mouseenter', function(e)
				{
					if (!feeDragInProgress)
					{
						feeToolbar.setStyle('visibility', 'visible');

						if (feeActive != undefined)
						{
							feeActive.addClass('fee_flash');
						}
					}
				});

				feeToolbar.addEvent('mouseleave', function(e)
				{
					if (!feeDragInProgress)
					{
						feeToolbar.setStyle('visibility', 'hidden');

						if (feeActive != undefined)
						{
							feeActive.removeClass('fee_flash');
						}
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
			'html' : '<a id="fee_preview_icon" accesskey="p"></a>'
		});

		$(document.body).grab(feePreview, 'bottom');

		$('fee_preview_icon').setStyle('background-position', '0 '+(Cookie.read('FE_PREVIEW')==1?'-32px':'0'));

	
		feePreview.addEvent('click', function(e)
		{
			if (Cookie.read('FE_PREVIEW') == 1)
			{
				Cookie.write('FE_PREVIEW', '', feeCookieSettings);
			}
			else
			{
				Cookie.write('FE_PREVIEW', '1', feeCookieSettings);
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
					contentLink = false;

					if (reload)
					{
						window.location.reload();
					}
				}
			};


			$$('a.cerabox').cerabox(
			{
/*
				width: function(el)
				{
					console.log('width: function(el)');

					if ($$(el).get('data-mediabox') == 'content')
					{
						return '750px';
					}
					else
					{
						return '980px';
					}
				},
*/
				//height: $(window).getSize().y+'px',
				height: '95%',
				fullSize: true,
				group: false,
				fixedPosition: true,
				preventScrolling: true,
				//mobileView: false,
				animation: 'ease',
				loaderAtItem: true,
				clickToClose: false,
				clickToCloseOverlay: false,
				preventScrolling: true,
				displayTitle: false,
				loaderAtItem: true,
				events:
				{
					onOpen: function(el)
					{
						feeToolbar.close();

						bodyTop = $(document.body).getScroll().y;
						bodyPosition = $(document.body).getStyle('position');
						
						$(document.body).setStyle('position', 'fixed');

						reloadOnClose = false;
						contentLink = false;

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
