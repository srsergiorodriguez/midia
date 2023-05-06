<script>
  import { int36, hex } from '../stores/helpers';
  export let value;
  export let options;
  export let callback = () => {};
  const regexOptions = setRegexOptions(options);

  function setRegexOptions(options) {
    return new RegExp(`${options.join("|")}`,"i");
  }

  function selectEditable(e) {
    window.getSelection().selectAllChildren(e.target);
  }

  function handleKey(e) {
    e.preventDefault();
    const k = e.key;
    if (regexOptions.test(k) && k.length === 1) {
      value = $int36(k);
      e.target.textContent = k.toUpperCase();
    }
    window.getSelection().selectAllChildren(e.target);
    callback();
  }
</script>

<span on:focus={selectEditable} on:keydown={e => { handleKey(e)}} contenteditable draggable="false" class='cell'>{$hex(value)}</span>