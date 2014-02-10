/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @version 	2.2.1
 *
 * This package requires
 * - JQuery >
 * - JQuery Colorbox
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2014 Lingo4you, <http://www.lingolia.com/>
 *
 */

(function($)
{
	jQuery(function($)
	{
		/**
		 * Create toolbar with buttons
		 */
	 	feeToolbar = $('<div>',
	 	{
	 		'id' : 'fee_toolbar',
	 		'class' : 'no-sc fee_toolbar',
	 		'html' : '<p id="fee_statusbar"></p>'
	 	});

	 	/**
	 	 * Add list with toolbar buttons
	 	 */
	 	feeToolbarList = $('<ul>');

	 	feeToolbarList
	 		.append('<li id="fee_content_edit_item"><a id="fee_content_edit" class="mediabox" data-mediabox="content" href=""></a></li>')

		 	.append('<li id="fee_article_edit_item"><a id="fee_article_edit" class="mediabox" href=""></a></li>')

		 	.append('<li id="fee_page_edit_item"><a id="fee_page_edit" class="mediabox" href=""></a></li>')

		 	.append('<li id="fee_news_edit_item"><a id="fee_news_edit" class="mediabox" href=""></a></li>')
		 	
		 	.append('<li id="fee_content_add_item"><a id="fee_content_add" class="mediabox" data-mediabox="content" href=""></a></li>');

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
			$('#fee_settings_icon').css('background-position', '0 '+(checked==1?'-32px':'0'));
			$(this).data('checked', checked);

			$.cookie('fee_checked', checked);
			
			if (checked == 1)
			{
				$('.fe_editor').addClass('fee_editable');
				
				$('.fe_editor').bind('mouseenter', function(e)
				{
					data = JSON.parse($(this).attr('data-fee'));

					//$(this).prepend(feeToolbar);

					if (data.content != undefined)
					{
						if (data.contentTitle != undefined)
						{
							$('#fee_content_edit').attr('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=edit&fee=1&rt='+data.rt+'&id='+data.content);
							$('#fee_content_edit').attr('data-statusbar', data.contentTitle);

							$('#fee_statusbar').text(data.contentTitle);
						}
						else
						{
							$('#fee_content_edit_item').css('display', 'none');
						}

						if (data.contentAddTitle != undefined)
						{
							$('#fee_content_add').attr('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=create&fee=1&mode=1&pid='+data.content+'&id='+data.article+'&rt='+data.rt);
							$('#fee_content_add').attr('data-statusbar', data.contentAddTitle);
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
							$('#fee_content_edit').attr('href', 'contao/main.php?do=news&table=tl_news&act=edit&fee=1&rt='+data.rt+'&id='+data.news);
							$('#fee_content_edit').attr('data-statusbar', data.newsTitle);
							$('#fee_news_edit').attr('href', 'contao/main.php?do=news&table=tl_news&id='+data.newsArchive+'&rt='+data.rt);
							$('#fee_news_edit').attr('data-statusbar', data.newsArchiveTitle);

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
						$('#fee_article_edit').attr('href', 'contao/main.php?do=article&table=tl_content&rt='+data.rt+'&id='+data.article);
						$('#fee_article_edit').attr('data-statusbar', data.articleTitle);
					}
					else
					{
						$('#fee_article_edit_item').css('display', 'none');
					}

					if (data.pageTitle != undefined)
					{
						$('#fee_page_edit').attr('href', 'contao/main.php?do=page&act=edit&rt='+data.rt+'&id='+data.page);
						$('#fee_page_edit').attr('data-statusbar', data.pageTitle);
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

		state = $.cookie('fee_checked');

		feeSettings.setState((state=='null' ? 0 : state), false);
	
		feeSettings.bind('click', function(e)
		{
			feeSettings.setState(($('#fee_settings').data('checked')==1 ? 0 : 1), true);
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

		$('#fee_preview_icon').css('background-position', '0 '+($.cookie('FE_PREVIEW')==1?'-32px':'0'));
	
		feePreview.bind('click', function(e)
		{
			if ($.cookie('FE_PREVIEW') == 1)
			{
				$.cookie('FE_PREVIEW', '');
			}
			else
			{
				$.cookie('FE_PREVIEW', '1');
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

				if (reload)
				{
					window.location.reload();
				}
			}
		};


		$('a.mediabox').colorbox({
			iframe : true,
			rel : false,
			arrowKey : false,
			fixed : true,
			opacity: 0.5,
			innerWidth: function()
			{
				if ($(this).attr('data-mediabox') == 'content')
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
				if ($(this).attr('data-mediabox') == 'content')
				{
					window.onLoadContaoBackend = onLoadContaoBackend;
				}
				else
				{
					window.onLoadContaoBackend = function(href, reload) {};
				}
			}
		});

		$('#fee_toolbar a').bind('click', function(e)
		{
			feeToolbar.css('visibility', 'hidden');
		});
		
		$('#fee_toolbar a')
			.bind('mouseenter', function(e)
			{
				$('#fee_statusbar').text($(this).attr('data-statusbar'));
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
