export const getRelativeTime = (time) => {

  if (time < 60) {
    return `0:${Math.round(time)}`;
  } else {
    return `${Math.floor(time / 60)}:${Math.floor(time % 60)}`;
  }
}