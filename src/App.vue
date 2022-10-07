
<template>
    <div class="control">
        <p><input type="range"  style="width:90%" min="0" max="180" step="0.01" v-model="r_angle_step"></p>
        <p>
            Угол: <input  class="num" type="number" min="0" max="180" step="0.1" v-model="r_angle_step">
            Число зерен: <input type="number"   class="num" @change="draw" v-model="r_count">
            Радиус зерна: <input type="number"  class="num" @change="draw" v-model="r_radius">
        </p>
        <p>
            <input type="checkbox" @change="draw" v-model="view_points"> Зерна
            <input type="checkbox" @change="draw" v-model="view_line"> Генетическая спираль
        </p>
        <p>Cпираль № <input class="num" type="number" @change="draw" v-model="r_P"> из <input class="num" type="number" @change="draw" v-model="r_N"></p>


    </div>
    <canvas class="canvas" ref="canvas" :width="r_width" :height="r_height"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";

let r_width = ref(500)
let r_height = ref(500)

let r_angle_step = ref(137.5)

let r_length_step = ref(6)
let r_radius = ref(3)
let r_count = ref(1500)
let r_N = ref(0)
let r_P = ref(1)

let view_line = ref(false)
let view_points = ref(true)

/** @type {{value:HTMLCanvasElement}} */
let canvas = ref()

let draw = () => {
    const ctx = canvas.value.getContext('2d');
    let length_step = Number(r_length_step.value)
    let angle_step = Number(r_angle_step.value)
    let width = Number(r_width.value)
    let height = Number(r_height.value)
    let radius = Number(r_radius.value)
    let count = Number(r_count.value)

    let begin_color = [165,255,0]
    let end_color = [255,165,0]

    ctx.clearRect(0, 0, width, height);

    if (view_line.value){

        let angle = 0
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.beginPath();
        for(let i=0; i<count; i++){
            let point = [
                width/2 + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                height/2 + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ]
            let color = [
                Math.ceil((1-i/count)*begin_color[0] + i/count*end_color[0]),
                Math.ceil((1-i/count)*begin_color[1] + i/count*end_color[1]),
                Math.ceil((1-i/count)*begin_color[2] + i/count*end_color[2]),
            ]

            ctx.strokeStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            if (i%r_N.value === (r_P.value-1)%r_N.value) {
                ctx.strokeStyle = "white"
            }

            ctx.lineTo(...[
                width/2 + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                height/2 + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ])
            angle += angle_step
        }
        ctx.stroke();
    }

    if (view_points.value){
        let angle = 0

        for(let i=0; i<count; i++){
            let point = [
                width/2 + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                height/2 + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ]
            let color = [
                Math.ceil((1-i/count)*begin_color[0] + i/count*end_color[0]),
                Math.ceil((1-i/count)*begin_color[1] + i/count*end_color[1]),
                Math.ceil((1-i/count)*begin_color[2] + i/count*end_color[2]),
            ]
            ctx.fillStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            if (i%r_N.value === (r_P.value-1)%r_N.value) {
                ctx.fillStyle = "white"
            }
                ctx.beginPath();
                ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI, false);
                ctx.fill();
            angle += angle_step
        }
    }

}

onMounted(draw)

watch(r_angle_step, draw)
watch(r_radius, draw)

watch(r_count, (count)=>{
    r_length_step.value = Math.floor(r_width.value/(2*Math.sqrt(count)))-1
    r_radius.value = Math.floor(r_length_step.value/2)
    draw()
})

</script>

<style>
.control{
    top:0;
    left:0;
    width:100vw;
    position: absolute;
}
.num{
    width: 50px !important;
}
</style>
