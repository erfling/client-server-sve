<?php
    
    $sourceString = $_SERVER['HTTP_USER_AGENT'];

    $isIOS = preg_match('[iPad|iPhone|iphone|iPod]', $sourceString);

    if($isIOS){
        echo "IOS DEVICE DETECTED<br>";
        $versionArray = preg_match("/(.*) OS ([0-9]*)_(.*)_(.*)\//", $sourceString, $output);
        echo "<pre>";
        print_r($output);
        echo "</pre>";
        if($output != null){
            $version = $output[2] . "." . $output[3];
        }        
    }

    if(isset($version) && $version < 10.3){
        echo "Our software won't work on your device because you're using IOS " . $version;
    } else {
        readfile("/sapien/client-server-sve/dist/index.html");
    }
?>