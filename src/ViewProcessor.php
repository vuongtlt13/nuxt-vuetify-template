<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Vuongdq\VLAdminTool\Commands\Base\BaseCommand;
use Vuongdq\VLAdminTool\Utils\FileUtil;

class ViewProcessor extends BaseCommand {
    protected $apiMode = false;
    private $force = false;
    private $templateType = "";

    public function __construct() {
        $this->output = new \Symfony\Component\Console\Output\ConsoleOutput();
    }

    public function generateLayout($isApiMode, $force = false) {
        if ($isApiMode) {
            $this->apiMode = $isApiMode;
            $this->force = $force;
            $this->baseFolder = dirname(app_path()) . DIRECTORY_SEPARATOR . "frontend";
            $this->templateType = "nuxt-vuetify-template";
            $this->handle();
        }
    }

    public function handle() {
        $this->generatePackageJson();
        $this->generateTSConfig();
        FileUtil::createDirectoryIfNotExist($this->baseFolder);

        $sourceDir = get_templates_package_path($this->templateType).'/templates/frontend';
        FileUtil::copyDirectory($sourceDir, $this->baseFolder, $this->force);
        $this->info("Frontend directory generated!");
    }

    public function generatePackageJson() {
        $templateData = get_template('layouts.package', $this->templateType);

        $destPath = getcwd() . DIRECTORY_SEPARATOR;
        $fileName = "package.json";

        if (file_exists($destPath.$fileName) && !$this->force) {
            $this->commandData->commandInfo('Package.json existed! Skip!');
            return;
        }

        FileUtil::createFile($destPath, $fileName, $templateData);

        $this->info('Package.json created');
    }

    public function generateTSConfig() {
        $templateData = get_template('layouts.tsconfig', $this->templateType);

        $destPath = getcwd() . DIRECTORY_SEPARATOR;
        $fileName = "tsconfig.json";

        if (file_exists($destPath.$fileName) && !$this->force) {
            $this->commandData->commandInfo('tsconfig.json existed! Skip!');
            return;
        }

        FileUtil::createFile($destPath, $fileName, $templateData);

        $this->info('tsconfig.json created');
    }
}
