/**
 * @package		fe_editor
 *
 * @author 		Mario Müller
 * @version 	2.0.0
 *
 * This package requires
 * - JQuery >
 * - JQuery Colorbox
 *
 * @license http://opensource.org/licenses/lgpl-3.0.html
 *
 * Copyright (c) 2013 Lingo4you, <http://www.lingolia.com/>
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
	 		.append('<li id="fee_content_edit_item"><a id="fee_content_edit" class="mediabox" data-mediabox="content" href=""><img src="system/modules/fe_editor/assets/images/pencil.png" width="16" height="16" alt="c"></a></li>')

		 	.append('<li id="fee_article_edit_item"><a id="fee_article_edit" class="mediabox" href=""><img src="system/modules/fe_editor/assets/images/page_white_edit.png" width="16" height="16" alt="a"></a></li>')

		 	.append('<li id="fee_page_edit_item"><a id="fee_page_edit" class="mediabox" href=""><img src="system/modules/fe_editor/assets/images/page_edit.png" width="16" height="16" alt="p"></a></li>')

		 	.append('<li id="fee_news_edit_item"><a id="fee_news_edit" class="mediabox" href=""><img src="system/modules/fe_editor/assets/images/script_edit.png" width="16" height="16" alt="n"></a></li>')
		 	
		 	.append('<li id="fee_content_add_item"><a id="fee_content_add" class="mediabox" data-mediabox="content" href=""><img src="system/modules/fe_editor/assets/images/pencil_add.png" width="16" height="16" alt="+"></a></li>');

	 	feeToolbar.prepend(feeToolbarList);


		/**
		 * Create settings button to switch FEE ON or OFF
		 */
		var feeSettings = $('<div>',
		{
			'id' : 'fee_settings',
			'html' : '<a accesskey="e"></a>'
		});
	
		$(document.body).append(feeSettings);

		$(document.body).append(feeToolbar);

		feeSettings.setState = function(checked, flash)
		{
			$(this).css('background-image', 'url(system/modules/fe_editor/assets/images/application'+(checked==1?'_edit.png':'.png')+')');
			$(this).data('checked', checked);

			$.cookie('fee_checked', checked);

			if (checked == 1)
			{
				$('.fe_editor').addClass('fee_editable');
				
				$('.fe_editor').bind('mouseenter', function(e)
				{
					data = JSON.parse($(this).attr('data-fee'));

					$(this).prepend(feeToolbar);

					if (data.content != undefined)
					{
						if (data.contentTitle != undefined)
						{
							$('#fee_content_edit').attr('href', 'contao/main.php?do='+data.do+'&table=tl_content&act=edit&fee=1&rt='+data.rt+'&id='+data.content);
							$('#fee_content_edit').attr('data-statusbar', data.contentTitle);

							$('#fee_statusbar').attr('text', data.contentTitle);
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
							
							$('#fee_statusbar').attr('text', data.newsTitle);
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

					feeToolbar.css('left', $(this).offset().left);
					feeToolbar.css('top', $(this).offset().top);

					if ($(this).offset().top < 35)
					{
						feeToolbar.css('margin-top', '0');
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
			'html' : '<a accesskey="p"></a>'
		});

		feePreview.css('background-image', 'url(system/modules/fe_editor/assets/images/lightbulb'+($.cookie('FE_PREVIEW')==1?'.png':'_off.png')+')');
	
		$(document.body).append(feePreview);
	
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

		
		$('#fee_toolbar a')
			.bind('mouseenter', function(e)
			{
				$('#fee_statusbar').text($(this).attr('data-statusbar'));
			});

		$('#fee_content_edit')
			.bind('mouseenter', function(e) {
				$(this).parents('.fe_editor')
					.css('outline-color', 'red');
			})
			.bind('mouseleave', function(e) {
				$(this).parents('.fe_editor').css('outline-color', 'black');
			});

		$('#fee_content_add')
			.bind('mouseenter', function(e) {
				$(this).parents('.fe_editor')
					.css('outline-color', 'green');
			})
			.bind('mouseleave', function(e) {
				$(this).parents('.fe_editor').css('outline-color', 'black');
			});
	
		$('#fee_article_edit')
			.bind('mouseenter', function(e) {
				$(this).parents('.mod_article')
					.css({
						'outline': '2px dotted red',
						'outline-offset': '-2px'
					});
			})
			.bind('mouseleave', function(e) {
				$(this).parents('.mod_article').css('outline', 'none');
			});
	
		$('#fee_page_edit')
			.bind('mouseenter', function(e) {
				$(document.body)
					.css({
						'outline': '5px dotted red',
						'outline-offset': '-5px'
					});
			})
			.bind('mouseleave', function(e) {
				$(document.body).css('outline', 'none');
			});

	});
})(document.id);
