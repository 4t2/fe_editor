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
			width: '960px',
			group: false,
			fixedPosition: false,
			animation: 'ease',
			events: {
				onOpen: function(e) {
					//console.log('onOpen');
					reloadOnClose = false;
				},
				onChange: function(e) {
					//console.log('onChange ' + e);
					reloadOnClose = true;
				},
				onClose: function(e) {
					//console.log('onClose');
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
				.setStyle('outline-color', 'red')
				.highlight();
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});
	
	$$('.fee_content_add a')
		.addEvent('mouseenter', function(e) {
			//this.getParent('.fe_editor').store(this.getParent('.fe_editor').getStyle('border-bottom'));
			//this.getParent('.fe_editor').setStyle('border-bottom', '10px solid green');
			this.getParent('.fe_editor')
				.setStyle('outline-color', 'green')
				.highlight('#0f0');
		})
		.addEvent('mouseleave', function(e) {
			//this.getParent('.fe_editor').setStyle('border-bottom', this.getParent('.fe_editor').retrieve('border-bottom'));
			this.getParent('.fe_editor').setStyle('outline-color', 'black');
		});

	$$('.fee_article_edit a')
		.addEvent('mouseenter', function(e) {
			this.getParent('.mod_article')
				.setStyles({
					'outline': '2px dotted red',
					'outline-offset': '-2px'
				})
				.highlight();
			//this.getParent('.fe_editor').setStyle('outline', 'none');
		})
		.addEvent('mouseleave', function(e) {
			this.getParent('.mod_article').setStyle('outline', 'none');
			//this.getParent('.fe_editor').setStyle('outline', '2px dotted black');
		});

	$$('.fee_page_edit a')
		.addEvent('mouseenter', function(e) {
			$(document.body)
				.setStyles({
					'outline': '5px dotted red',
					'outline-offset': '-5px',
				});
			//this.getParent('.fe_editor').setStyle('outline', 'none');
		})
		.addEvent('mouseleave', function(e) {
			$(document.body).setStyle('outline', 'none');
			//this.getParent('.fe_editor').setStyle('outline', '2px dotted black');
		});

});