<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Vuongdq\VLAdminTool\Common\GeneratorField;

class HTMLFieldGenerator {
    public static function generateHTML(GeneratorField $field, $templateType)
    {
        $fieldTemplate = '';

        switch ($field->htmlType) {
            case 'text':
            case 'textarea':
            case 'date':
            case 'datetime':
            case 'file':
            case 'email':
            case 'password':
            case 'number':
            case 'checkbox':
            case 'toggle-switch':
                $fieldTemplate = get_template('fields.'.$field->htmlType, $templateType);
                break;
            case 'select':
            case 'enum':
                $fieldTemplate = get_template('fields.select', $templateType);
                break;
            case 'radio':
                $fieldTemplate = get_template('fields.radio_group', $templateType);
                $radioTemplate = get_template('fields.radio', $templateType);
                break;
        }

        return $fieldTemplate;
    }

    public static function generateDefaultValue($htmlType)
    {
        switch ($htmlType) {
            case 'checkbox':
                return false;
            default:
                return '';
        }
    }
}
