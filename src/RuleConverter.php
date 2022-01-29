<?php

namespace Vuongdq\NuxtVuetifyTemplate;

class RuleConverter {
    public static function convertRule($rule, $rules) {
        $parts = explode(":", $rule);
        $type = $parts[0];
        if (count($parts) == 2) $params = $parts[1];

        switch ($type) {
            case "string":
            case "sometimes":
            case "nullable":
            case "unique":
                return "";
                break;
            case "boolean":
                return "oneOf:0,1";
                break;
            case "numeric":
                return "double";
                break;
            case "in":
                return implode(":", ["oneOf", $params]);
                break;
            case "min":
                if (self::isNumber($rules)) {
                    return implode(":", ["min_value", $params]);
                }
                return implode(":", ["min", $params]);
                break;
            case "max":
                if (self::isNumber($rules)) {
                    return implode(":", ["max_value", $params]);
                }
                return implode(":", ["max", $params]);
                break;
            case "image":
                return "mimes:image/*";
                break;
            case "mimetypes":
                return implode(":", ["mimes", $params]);
                break;
            default:
                return $rule;
        }
    }

    public static function isNumber($rules) {
        return in_array("integer", $rules) || in_array("numeric", $rules);
    }
}
