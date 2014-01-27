<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_settings']['frontend_editor_legend'] = 'Frontend-Editor settings';


$GLOBALS['TL_LANG']['tl_settings']['frontendEditorFramework'] = array
(
	'title' => array('JavaScript Framework', 'Which JavaScript Framework should be used.'),
	'reference' => array
	(
		'auto' => 'auto detect',
		'mootools' => 'MooTools',
		'jquery' => 'jQuery'
	)
);

$GLOBALS['TL_LANG']['tl_settings']['frontendEditorReload'] = array('Reload page', 'Instant reload a page if it has been changed in Frontend Editor.');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorElements'] = array('HTML elements', 'Allowed HTML elements.');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorIgnoreClasses'] = array('Ignore classes', 'Ignore elements with this classes.');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorIgnoreContent'] = array('Ignore content elements', 'Ignore these content elements.');

$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditContent'] = array('Edit content elements', 'Group can edit content elements');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorAssetsUrl'] = array('Assets URL', 'Assets URL folder (only Contao 2.x)');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditNews'] = array('Edit news', 'Group can edit news');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditArticle'] = array('Edit articles', 'Group can edit articles');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditPage'] = array('Edit pages', 'Group can edit pages');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorAddContent'] = array('Add content elements', 'Group can add content elements');
