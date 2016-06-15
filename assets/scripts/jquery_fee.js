/**
 * @package		fe_editor
 *
 * @author 		Mario Müller <mario@lingo4u.de>
 * @version 	2.3.0
 *
 * This package requires
 * - JQuery >
 * - JQuery Colorbox
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright © 2016 Lingo4you, <https://www.lingolia.com/>
 *
 */

function setFeeCookie(name, value)
{
	if (typeof value == 'boolean')
	{
		value = (value ? '1' : '');
	}

	var cookie = name + '=' + value;

	cookie += '; max-age=' + 60*60*24*30;
	cookie += '; path=/';
	cookie += (feeCookieDomain != '' ? '; domain=' + feeCookieDomain : '');
	// cookie += '; secure';

	document.cookie = cookie;
}

function isFeeCookie(name, value)
{
	if (typeof value == 'boolean')
	{
		value = (value ? '1' : '');
	}

	return document.cookie.indexOf(name + '=' + value) != -1;
}


(function($)
{
	jQuery(function($)
	{
		/**
		 * Create toolbar with buttons
		 */
	 	var feeToolbar = $('<div>',
	 	{
	 		'id' : 'fee_toolbar',
	 		'class' : 'no-sc fee_toolbar',
	 		'html' : '<p id="fee_statusbar"></p>'
	 	});

	 	/**
	 	 * Add list with toolbar buttons
	 	 */
	 	var feeToolbarList = $('<ul>');

	 	feeToolbarList
	 		.append('<li id="fee_content_edit_item"><span id="fee_content_edit" class="mediabox" data-mediabox="content"></span></li>')
		 	.append('<li id="fee_article_edit_item"><span id="fee_article_edit" class="mediabox"></span></li>')
		 	.append('<li id="fee_page_edit_item"><span id="fee_page_edit" class="mediabox"></span></li>')
		 	.append('<li id="fee_news_edit_item"><span id="fee_news_edit" class="mediabox"></span></li>')
		 	.append('<li id="fee_content_add_item"><span id="fee_content_add" class="mediabox" data-mediabox="content"></span></li>');

	 	feeToolbar.prepend(feeToolbarList);


		/**
		 * Create settings button to switch FEE ON or OFF
		 */
		var feeSettings = $('<div>',
		{
			'id' : 'fee_settings',
			'html' : '<a id="fee_settings_icon" accesskey="e"></a>'
		});

		$(document.body).append(feeSettings);

		$(document.body).append(feeToolbar);
		
		var feeActive = undefined;

		feeSettings.setState = function(checked, flash)
		{
			$('#fee_settings_icon').css('background-position', '0 '+(checked ? '-32px' : '0'));
			$(this).data('checked', checked);

			//$.cookie('fee_checked', checked, { 'domain' : feeCookieDomain });
			
			if (checked)
			{
				$('.fe_editor').addClass('fee_editable');
				
				$('.fe_editor').bind('mouseenter', function(e)
				{
//					data = JSON.parse($(this).data('fee'));
					data = $(this).data('fee');

					if (data.content != undefined)
					{
						if (data.contentTitle != undefined)
						{
							$('#fee_content_edit').data('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=edit&fee=1&rt='+data.rt+'&id='+data.content);
							$('#fee_content_edit').data('statusbar', data.contentTitle);

							$('#fee_statusbar').text(data.contentTitle);
						}
						else
						{
							$('#fee_content_edit_item').css('display', 'none');
						}

						if (data.contentAddTitle != undefined)
						{
							$('#fee_content_add').data('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=create&fee=1&mode=1&pid='+data.content+'&id='+data.article+'&rt='+data.rt);
							$('#fee_content_add').data('statusbar', data.contentAddTitle);
							$('#fee_content_add_item').css('display', 'inline-block');
						}
						else
						{
							$('#fee_content_add_item').css('display', 'none');
						}
						
						$('#fee_news_edit_item').css('display', 'none');	
					}
					else if (data.news != undefined)
					{
						if (data.newsTitle != undefined)
						{
							$('#fee_content_edit').data('href', 'contao/main.php?do=news&table=tl_news&act=edit&fee=1&rt='+data.rt+'&id='+data.news);
							$('#fee_content_edit').data('statusbar', data.newsTitle);
							$('#fee_news_edit').data('href', 'contao/main.php?do=news&table=tl_news&id='+data.newsArchive+'&rt='+data.rt);
							$('#fee_news_edit').data('statusbar', data.newsArchiveTitle);

							$('#fee_news_edit_item').css('display', 'inline-block');
							
							$('#fee_statusbar').text(data.newsTitle);
						}
						else
						{
							$('#fee_content_edit_item').css('display', 'none');
							$('#fee_news_edit_item').css('display', 'none');
						}

						$('#fee_content_add_item').css('display', 'none');
					}

					if (data.articleTitle != undefined)
					{
						$('#fee_article_edit').data('href', 'contao/main.php?do=article&table=tl_content&rt='+data.rt+'&id='+data.article);
						$('#fee_article_edit').data('statusbar', data.articleTitle);
					}
					else
					{
						$('#fee_article_edit_item').css('display', 'none');
					}

					if (data.pageTitle != undefined)
					{
						$('#fee_page_edit').data('href', 'contao/main.php?do=page&act=edit&rt='+data.rt+'&id='+data.page);
						$('#fee_page_edit').data('statusbar', data.pageTitle);
					}
					else
					{
						$('#fee_page_edit_item').css('display', 'none');
					}

					offset = $(this).offset();

					feeToolbar.offset({ left: offset.left, top: (offset.top > 42 ? offset.top-42 : offset.top)});
					
					feeToolbar.css('visibility', 'visible');
					
					feeActive = $(this);
				});
				
				$('.fe_editor').bind('mouseleave', function(e)
				{
					feeToolbar.css('visibility', 'hidden');
				});


				feeToolbar.bind('mouseenter', function(e)
				{
					feeToolbar.css('visibility', 'visible');

					if (feeActive != undefined)
					{
						feeActive.addClass('fee_flash');
					}
				});

				feeToolbar.bind('mouseleave', function(e)
				{
					feeToolbar.css('visibility', 'hidden');

					if (feeActive != undefined)
					{
						feeActive.removeClass('fee_flash');
					}
				});


				if (flash)
				{
					$('.fe_editor').addClass('fee_flash');
	
					setTimeout(function()
					{
						$('.fe_editor').removeClass('fee_flash');
					}, 250);
				}
			}
			else
			{
				$('.fe_editor').removeClass('fee_editable');
				$('.fe_editor').unbind('mouseenter');
				$('.fe_editor').unbind('mouseleave');
			}
		};

		var state = isFeeCookie('FEE_CHECKED', '1');

		feeSettings.setState(state);
	
		feeSettings.bind('click', function(e)
		{
			var state = $('#fee_settings').data('checked');

			state = !state;

			setFeeCookie('FEE_CHECKED', state);
			feeSettings.setState(state, true);
		});
	

		/**
		 * Create frontend preview button
		 */
		var feePreview = $('<div>',
		{
			'id' : 'fee_preview',
			'html' : '<a id="fee_preview_icon" accesskey="p"></a>'
		});

		$(document.body).append(feePreview);

		$('#fee_preview_icon').css('background-position', '0 '+(isFeeCookie('FE_PREVIEW', '1') ? '-32px' : '0'));
	
		feePreview.bind('click', function(e)
		{
			if (isFeeCookie('FE_PREVIEW', '1'))
			{
				setFeeCookie('FE_PREVIEW', false);
			}
			else
			{
				setFeeCookie('FE_PREVIEW', true);
			}

			document.location.reload();
		});


		reloadOnClose = false;
		bodyPosition = 'relative';
		bodyTop = 0;

		contentLink = false;

		onLoadContaoBackend = function(href, reload)
		{
			if (contentLink == false)
			{
				contentLink = href;
			}
			else if (contentLink != href)
			{
				$.colorbox.close();
				contentLink = false;

				if (reload)
				{
					window.location.reload();
				}
			}
		};


		$('span.mediabox').colorbox({
			iframe : true,
			rel : false,
			arrowKey : false,
			fixed : true,
			opacity: 0.5,
			href: function()
			{
				return $(this).data('href');
			},
			innerWidth: function()
			{
				if ($(this).data('mediabox') == 'content')
				{
					return '780px';
				}
				else
				{
					return '980px';
				}
			},
			innerHeight: '95%',
			onLoad: function()
			{
				contentLink = false;

				if ($(this).data('mediabox') == 'content')
				{
					window.onLoadContaoBackend = onLoadContaoBackend;
				}
				else
				{
					window.onLoadContaoBackend = function(href, reload) {};
				}
			}
		});

		$('#fee_toolbar span').bind('click', function(e)
		{
			feeToolbar.css('visibility', 'hidden');
		});
		
		$('#fee_toolbar span')
			.bind('mouseenter', function(e)
			{
				$('#fee_statusbar').text($(this).data('statusbar'));
			});

		$('#fee_content_edit')
			.bind('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.css('outline-color', 'red');
				}
			})
			.bind('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.css('outline-color', 'black');
				}
			});

		$('#fee_content_add')
			.bind('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.css('outline-color', 'green');
				}
			})
			.bind('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.css('outline-color', 'black');
				}
			});
	
		$('#fee_article_edit')
			.bind('mouseenter', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.parents('.mod_article').css({
						'outline': '2px dotted red',
						'outline-offset': '-2px'
					});
				}
			})
			.bind('mouseleave', function(e)
			{
				if (feeActive != undefined)
				{
					feeActive.parents('.mod_article').css('outline', 'none');
				}
			});
	
		$('#fee_page_edit')
			.bind('mouseenter', function(e)
			{
				$(document.body)
					.css({
						'outline': '5px dotted red',
						'outline-offset': '-5px'
					});
			})
			.bind('mouseleave', function(e)
			{
				$(document.body).css('outline', 'none');
			});

	});
})(document.id);
