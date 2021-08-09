<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue" />
    <main>
      <h2 class="title text-center">Sjoeff Printer Server is active</h2>
      <p class="text-center">
        You can configure default printer and other settings
        <a
          href="#"
          @click="open('http://www.verzendbeheer-toplock.nl/settings/printer')"
        >
          here
        </a>
      </p>
      <div class="row">
        <div>
          <h4>Printers</h4>
          <p v-for="(printer, i) in printers" :key="i">
            {{ printer.name }}
          </p>
        </div>
        <div>
          <div class="title">Recent Labels</div>
          <div class="task-list">
            <div
              v-for="(task, i) in tasks.slice().reverse()"
              :key="i"
              class="task success"
            >
              {{ task.url }}
              <p>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SystemInformation from './LandingPage/SystemInformation'
import { getPrinters } from 'pdf-to-printer'

export default {
  name: 'landing-page',
  components: { SystemInformation },
  data() {
    return {
      printers: []
    }
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  },
  computed: {
    tasks() {
      return this.$store.state.Task.tasks
    }
  },
  mounted() {
    getPrinters().then((printers) => (this.printers = printers))
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

.task.success {
  background-color: #22bb33;
  color: white;
}
.task {
  margin: 5px 0;
  padding: 5px;
}
.task-list {
  overflow: auto;
  height: 250px;
}
.row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 30px 0;
}
.text-center {
  text-align: center;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 30px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#logo {
  height: 100px;
  margin: auto;
  margin-bottom: 20px;
  width: auto;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
