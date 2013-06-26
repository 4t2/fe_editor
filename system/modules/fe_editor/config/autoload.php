<?php

/**
 * Contao Open Source CMS
 * 
 * Copyright (C) 2005-2012 Leo Feyer
 * 
 * @package Fe_editor
 * @link    http://contao.org
 * @license http://www.gnu.org/licenses/lgpl-3.0.html LGPL
 */


/**
 * Register the classes
 */
ClassLoader::addClasses(array
(
	'FrontendEditorHook'        => 'system/modules/fe_editor/FrontendEditorHook.php',
	'FrontendEditorBackendHook' => 'system/modules/fe_editor/FrontendEditorBackendHook.php'
));
