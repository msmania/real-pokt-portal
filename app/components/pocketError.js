export default function PocketError({err}) {
  if (!err) {
    return '';
  }

  let errMsg = 'Unexpected error';
  if (!'info' in err) {
    errMsg = 'err.info is not set';
  }
  else {
    const errInfo = err.info;
    if ('message' in errInfo) {
      const lines = errInfo.message.split('\n');
      if (lines.length > 1) {
        errMsg = lines.map(
          (line, idx) => <span key={idx}>{line}<br /></span>);
      }
      else if ('code' in errInfo) {
        errMsg = `${errInfo.message} (code: ${errInfo.code})`;
      }
      else if ('name' in errInfo) {
        errMsg = `${errInfo.name}: ${errInfo.message}`;
      }
      else {
        errMsg = errInfo.message;
      }
    }
    else {
      errMsg = 'err.info.message is not set';
    }
  }

  return (
    <p className='text-red-700'>
      {errMsg}
    </p>
  );
}
