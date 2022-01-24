<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Vuongdq\VLAdminTool\Common\CommandData;
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
                '$FIELD_DEFINITIONS$' => $fieldDefs
            ]
        );
    }

    public function generateVueFields() {
        $this->htmlFields = [];
        foreach ($this->commandData->fields as $field) {
            if (!$field->isCreatable && !$field->isEditable) {
                continue;
            }

        }
    }

    private function componentPath(string $fileName = null) {
        $basePath = FileUtil::joinPath($this->basePath, "components", $this->commandData->config->mDashedPlural);
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
}
