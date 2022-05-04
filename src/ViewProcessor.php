<?php

namespace Vuongdq\NuxtVuetifyTemplate;

use Symfony\Component\Process\Process;
use Vuongdq\VLAdminTool\Commands\Base\BaseCommand;
use Vuongdq\VLAdminTool\Utils\FileUtil;

class ViewProcessor extends BaseCommand {
    protected $apiMode = false;
    private $force = false;
    private $templateType = "";
    private $baseFolder = "";

    public function __construct() {
        $this->output = new \Symfony\Component\Console\Output\ConsoleOutput();
        $this->baseFolder = dirname(app_path()) . DIRECTORY_SEPARATOR . "frontend";
        $this->templateType = "nuxt-vuetify-template";
    }

    public function generateLayout($isApiMode, $force = false) {
        if ($isApiMode) {
            $this->apiMode = $isApiMode;
            $this->force = $force;
            $this->handle();
        } else {
            $this->info($this->templateType . " only work with API mode! Skiped");
        }
    }

    public function handle() {
        $this->generatePackageJson();
        $this->generateTSConfig();
        FileUtil::createDirectoryIfNotExist($this->baseFolder);

        # publish frontend template folder
        $sourceDir = get_templates_package_path($this->templateType).'/templates/frontend';
        FileUtil::copyDirectory($sourceDir, $this->baseFolder, $this->force);
        $this->info("Frontend directory generated!");

        # run yarn
        $process = new Process(['yarn']);
        $process->setTimeout(600);
        $process->start();
        $this->info("Running `yarn` command...");

        $iterator = $process->getIterator($process::ITER_SKIP_ERR | $process::ITER_KEEP_OUTPUT);
        foreach ($iterator as $data) {
            echo $data;
        }
    }

    public function generatePackageJson() {
        $templateData = get_template('layouts.package', $this->templateType);

        $destPath = getcwd() . DIRECTORY_SEPARATOR;
        $fileName = "package.json";

        if (file_exists($destPath.$fileName) && !$this->force) {
            $this->info('Package.json existed! Skip!');
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
            $this->info('tsconfig.json existed! Skip!');
            return;
        }

        FileUtil::createFile($destPath, $fileName, $templateData);

        $this->info('tsconfig.json created');
    }

    public function getViewPath() {
        return $this->baseFolder;
    }
}
