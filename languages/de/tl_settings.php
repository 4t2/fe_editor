<?php if (!defined('TL_ROOT')) die('You cannot access this file directly!');

/**
 * Legends
 */
$GLOBALS['TL_LANG']['tl_settings']['frontend_editor_legend'] = 'Frontend-Editor-Einstellungen';


$GLOBALS['TL_LANG']['tl_settings']['frontendEditorFramework'] = array
(
	'title' => array('JavaScript Framework', 'Welches JavaScript Framework wird im Frontend Editor verwendet.'),
	'reference' => array
	(
		'auto' => 'automatische Erkennung',
		'mootools' => 'MooTools',
		'jquery' => 'jQuery'
	)
);

$GLOBALS['TL_LANG']['tl_settings']['frontendEditorReload'] = array('Seite automatisch neu laden', 'Seite automatisch neu laden, wenn sie im Frontend Editor bearbeitet wurde.');

$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditContent'] = array('Inhaltselemente bearbeiten', 'Benutzergruppe darf Inhaltselemente bearbeiten');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditNews'] = array('Nachrichten bearbeiten', 'Benutzergruppe darf Nachrichten bearbeiten');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditArticle'] = array('Artikel bearbeiten', 'Benutzergruppe darf Artikel bearbeiten');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorEditPage'] = array('Seiten bearbeiten', 'Benutzergruppe darf Seiten bearbeiten');
$GLOBALS['TL_LANG']['tl_settings']['frontendEditorAddContent'] = array('Inhaltselemente hinzufügen', 'Benutzergruppe darf Inhaltselemente hinzufügen');
