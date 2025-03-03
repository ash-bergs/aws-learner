import { useTimer } from 'react-timer-hook';

const PomodoroTimer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const { seconds, minutes, start, pause, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
  });

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <div className="text-2xl">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <button onClick={start} className="m-1 p-1 bg-green-500 rounded-sm">
        Start
      </button>
      <button onClick={pause} className="m-1 p-1 bg-yellow-500 rounded-sm">
        Pause
      </button>
      <button
        onClick={() => restart(new Date(Date.now() + 25 * 60 * 1000))}
        className="m-1 p-1 bg-blue-500 rounded-sm"
      >
        Restart
      </button>
    </div>
  );
};

export default PomodoroTimer;
