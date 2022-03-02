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

    public static function generateDefaultValue($htmlType, $defaultValue)
    {
        switch ($htmlType) {
            case 'text':
            case 'textarea':
            case 'email':
            case 'password':
                if (is_null($defaultValue)) return '';
                return $defaultValue;
                break;
            case 'number':
                if (is_null($defaultValue)) return '';
                if (!is_numeric($defaultValue))
                    throw new \Exception("Default value must be numeric, but `$defaultValue` given");

                if (is_double($defaultValue))
                    return floatval($defaultValue);

                return intval($defaultValue);
                break;
            case 'float':
            case 'double':
                if (is_null($defaultValue)) return '';
                if (!is_numeric($defaultValue))
                    throw new \Exception("Default value must be numeric, but `$defaultValue` given");

                return floatval($defaultValue);
                break;
            case 'checkbox':
                if (is_null($defaultValue)) return false;
                $defaultValue = intval($defaultValue);
                return $defaultValue == 1;
                break;
            case 'select':
                if (is_null($defaultValue)) return '';
                if (is_numeric($defaultValue)) return intval($defaultValue);
                return $defaultValue;
            default:
                return '';
        }
    }
}
