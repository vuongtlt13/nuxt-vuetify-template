<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Vuongdq\VLAdminTool\Common\CommandData;
use Vuongdq\VLAdminTool\Common\GeneratorField;
use Vuongdq\VLAdminTool\Generators\BaseGenerator;
use Vuongdq\VLAdminTool\Utils\FileUtil;

class TemplateGenerator extends BaseGenerator {
    /** @var CommandData */
    protected $commandData;

    /** @var string */
    private $basePath;

    /** @var string */
    private $templateType;

    /** @var array */
    private $htmlFields;

    public function __construct(CommandData $commandData)
    {
        $this->commandData = $commandData;
        $this->basePath = dirname(app_path()) . DIRECTORY_SEPARATOR . "frontend";
        $this->templateType = "nuxt-vuetify-template";
    }

    public function generate() {
        $this->generateIndexPage();

        $this->generateDataTable();

        $this->generateFields();
        $this->generateToolbar();

        $this->generateDTO();
        $this->generateService();
    }

    private function generateDataTable() {
        $this->generateHeader();
    }

    private function generateHeader() {

    }

    private function generateIndexPage() {
        FileUtil::createDirectoryIfNotExist($this->pagePath());
        $this->renderCodeFromTemplate(
            'views.index',
            $this->templateType,
            'index.vue',
            $this->pagePath()
        );
    }

    private function pagePath() {
        return FileUtil::joinPath($this->basePath, "pages", $this->commandData->config->mDashedPlural);
    }

    private function generateFields() {
        $fieldDefs = $this->generateVueFields();
        $this->renderCodeFromTemplate(
            'views.field_structure',
            $this->templateType,
            'Fields.vue',
            $this->componentPath(),
            [
                '$FIELD_DEFINITIONS$' => prefix_tabs_each_line($fieldDefs, 1),
            ]
        );
    }

    public function generateVueFields() {
        $this->htmlFields = [];
        foreach ($this->commandData->fields as $field) {
            if (!$field->isCreatable && !$field->isEditable) {
                continue;
            }

            $fieldRule = $this->generateVeeValidationRule($field);
            $counter = $this->generateCounter($field);
            $fieldTemplate = HTMLFieldGenerator::generateHTML($field, $this->templateType);
            $fieldDef = fill_template([
                '$COUNTER_CONDITION$' => $counter,
                '$FIELD_RULE$' => $fieldRule
            ], $fieldTemplate);
            $fieldDef = fill_template_with_field_data(
                $this->commandData->dynamicVars,
                $this->commandData->fieldNamesMapping,
                $fieldDef,
                $field
            );
            $this->htmlFields[] = $fieldDef;
        }

        return implode("\n", $this->htmlFields);
    }

    private function generateCounter(GeneratorField $field) {
        $rules = explode("|", $field->validations);
        if (!RuleConverter::isNumber($rules)) {
            $maxRule = array_values(array_filter($rules, function ($rule) {
                return (Str::startsWith($rule, "max:"));
            }));
            if (count($maxRule) > 0) {
                $maxRule = $maxRule[0];
                $maxLength = explode(":", $maxRule)[1];
                return infy_nl(1) . infy_tabs(2, 2) . "counter=\"$maxLength\"";
            }
        }

        return "";
    }

    private function componentPath(string $fileName = null) {
        $basePath = FileUtil::joinPath($this->basePath, "components", $this->commandData->config->mDashed);
        if (!empty($fileName)) {
            return FileUtil::joinPath($basePath, $fileName);
        }
        return $basePath;
    }

    private function generateDTO() {

    }

    private function generateToolbar() {
    }

    private function generateService() {
    }

    private function generateVeeValidationRule(GeneratorField $field) {
        $rules = explode("|", $field->validations);
        $finalRules = [];
        foreach ($rules as $rule) {
            $convertedRule = RuleConverter::convertRule($rule, $rules);
            if (!empty($convertedRule)) {
                $finalRules[] = $convertedRule;
            }
        }

        return implode("|", array_unique($finalRules));
    }
}
