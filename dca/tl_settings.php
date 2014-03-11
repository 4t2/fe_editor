<?php if (!defined('TL_ROOT')) die('You can not access this file directly!');

/**
 * Contao Open Source CMS
 * Copyright (C) 2005-2014 Leo Feyer
 *
 * PHP version 5
 * @copyright  Lingo4you 2014
 * @author     Mario Müller <http://www.lingolia.com/>
 * @package    FrontendEditor
 * @license    http://opensource.org/licenses/lgpl-3.0.html
 */

/**
 * System configuration
 */
$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorFramework'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorFramework']['title'],
	'inputType'		=> 'select',
	'options'		=> array('auto', 'mootools', 'jquery'),
	'default'		=> 'auto',
	'reference'		=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorFramework']['reference'],
	'eval'			=> array
	(
		'maxlength'	=> 10,
		'tl_class'	=> 'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorReload'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorReload'],
	'inputType'		=> 'checkbox',
	'eval'			=> array
	(
		'tl_class'	=> 'w50 m12'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorElements'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorElements'],
	'inputType'		=> 'text',
	'eval'			=> array
	(
		'tl_class'	=> 'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorIgnoreClasses'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorIgnoreClasses'],
	'inputType'		=> 'text',
	'eval'			=> array
	(
		'tl_class'	=> 'w50'
	)
);


$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorIgnoreContent'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorIgnoreContent'],
	'inputType'		=> 'text',
	'eval'			=> array
	(
		'tl_class'	=> 'long'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorAssetsUrl'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorAssetsUrl'],
	'inputType'		=> 'text',
	'eval'			=> array
	(
		'tl_class'	=> 'long'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorEditContent'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditContent'],
	'inputType'		=> 'select',
	'options_callback'	=> array('tl_frontend_editor_settings', 'getUserGroups'),
	'eval'			=> array
	(
		'findInSet'	=> true,
		'tl_class'	=> 'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorEditNews'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditNews'],
	'inputType'		=> 'select',
	'options_callback'	=> array('tl_frontend_editor_settings', 'getUserGroups'),
	'eval'			=> array
	(
		'findInSet'	=> true,
		'tl_class'	=> 'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorEditArticle'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditArticle'],
	'inputType'		=> 'select',
	'options_callback'	=> array('tl_frontend_editor_settings', 'getUserGroups'),
	'eval'			=> array
	(
		'findInSet'	=> true,
		'tl_class'	=> 'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorEditPage'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditPage'],
	'inputType'		=> 'select',
	'options_callback'	=> array('tl_frontend_editor_settings', 'getUserGroups'),
	'eval'			=> array
	(
		'findInSet'	=> true,
		'tl_class'	=>	'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['fields']['frontendEditorAddContent'] = array
(
	'label'			=> &$GLOBALS['TL_LANG']['tl_settings']['frontendEditorAddContent'],
	'inputType'		=> 'select',
	'options_callback'	=> array('tl_frontend_editor_settings', 'getUserGroups'),
	'eval'			=> array
	(
		'findInSet'	=> true,
		'tl_class'	=>	'w50'
	)
);

$GLOBALS['TL_DCA']['tl_settings']['palettes']['default'] = preg_replace('|(\{frontend_legend\}[^;]+)|im', '$1;{frontend_editor_legend},frontendEditorFramework,frontendEditorReload,frontendEditorElements,frontendEditorIgnoreClasses,frontendEditorIgnoreContent,'.(defined('TL_ASSETS_URL')?'':'frontendEditorAssetsUrl,').'frontendEditorEditContent,frontendEditorEditNews,frontendEditorEditArticle,frontendEditorEditPage,frontendEditorAddContent', $GLOBALS['TL_DCA']['tl_settings']['palettes']['default']);


/**
 * Class tl_frontend_editor_settings
 */
class tl_frontend_editor_settings extends Backend
{
	protected $arrGroups;

	/**
	 * Import the back end user object
	 */
	public function __construct()
	{
		parent::__construct();
		
#		$this->loadLanguageFile('tl_settings');

		$this->arrGroups = array
		(
			'+' => $GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditGroups']['+'],
			'-' => $GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditGroups']['-']
		);

		$objGroups = $this->Database->prepare("SELECT `id`, `name` FROM tl_user_group WHERE disable!=1")->execute();

		while ($objGroups->next())
		{
			$this->arrGroups[$objGroups->id] = $objGroups->name . ' (ID '.$objGroups->id.')';
		}
	}


	public function getUserGroups($dc)
	{
		return $this->arrGroups;
	}

}
