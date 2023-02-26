import { Button } from '@mui/material'
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import React, { useEffect, useState } from "react";



const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }

    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <div className='flex flex-row bg-white drop-shadow-lg px-5 py-5 rounded-xl mt-5 self-center text-center items-center justify-items-center'>
        <Button style={{borderColor: '#FF6200', borderWidth: '1.5px', color: '#FF6200'}} variant='outlined' onClick={onClick}><InstallDesktopIcon fontSize="medium" /></Button>
        <div className='text-gray-400 text-l ml-3'>
            <div>App installieren, um sie Offline nutzen zu können</div>
        </div>
    </div>
  );
};

export default InstallPWA;