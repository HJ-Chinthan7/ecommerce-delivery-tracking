const  MessageBox=({ message })=>  {
  if (!message) return null;
  const isError = message.includes('Error');
  return (
    <div className={`mt-6 p-4 rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message}
    </div>
  );
}

export default MessageBox;