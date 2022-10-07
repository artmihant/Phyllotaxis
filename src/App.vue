
<template>
    <div class="control">
        <p><input type="range"  style="width:100%" min="0" max="360" step="0.01" v-model="r_angle_step"></p>
        <p>Угол: <input type="number" min="0" max="360" step="0.01" v-model="r_angle_step"></p>
        <p><input type="checkbox" @change="draw" v-model="view_line"> Линия <input type="checkbox" @change="draw" v-model="view_points"> Точки</p>
<!--        <p>Число зерен: <input type="number" v-model="r_count"> </p>-->
    </div>
    <canvas class="canvas" ref="canvas" :width="r_size*2" :height="r_size*2"></canvas>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
let r_size = 250

let r_angle_step = ref(99.5)

let r_length_step = ref(8)
let r_radius = ref(4)
let r_count = ref(960)

let view_line = ref(false)
let view_points = ref(true)

/** @type {{value:HTMLCanvasElement}} */
let canvas = ref()

let draw = () => {
    const ctx = canvas.value.getContext('2d');
    let length_step = Number(r_length_step.value)
    let angle_step = Number(r_angle_step.value)
    let size = Number(r_size.value)

    let radius = Number(r_radius.value)
    let count = Number(r_count.value)

    ctx.clearRect(0, 0, size*2, size*2);

    if (view_line.value){

        let point = [size, size]
        let angle = 0
        ctx.strokeStyle = "rgb(255,255,255)";
        ctx.beginPath();
        ctx.moveTo(...point);
        for(let i=1; i<count; i++){
            point = [
                size + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                size + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ]
            ctx.lineTo(...[
                size + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                size + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ])
            angle += angle_step
        }
        ctx.stroke();
    }

    let begin_color = [165,255,0]
    let end_color = [255,165,0]

    if (view_points.value){
        let angle = 0

        for(let i=0; i<count; i++){
            let point = [
                size + Math.ceil(length_step*Math.sqrt(i)*Math.cos(Math.PI*angle/180)),
                size + Math.ceil(length_step*Math.sqrt(i)*Math.sin(Math.PI*angle/180))
            ]
            let color = [
                Math.ceil((1-i/count)*begin_color[0] + i/count*end_color[0]),
                Math.ceil((1-i/count)*begin_color[1] + i/count*end_color[1]),
                Math.ceil((1-i/count)*begin_color[2] + i/count*end_color[2]),
            ]
            ctx.fillStyle = "rgb("+color[0]+","+color[1]+","+color[2]+")";
            ctx.beginPath();
            ctx.arc(point[0], point[1], radius, 0, 2 * Math.PI, false);
            ctx.fill();
            angle += angle_step
        }
    }

}

watch(r_angle_step, draw)

watch(r_count, (count)=>{
    r_length_step.value = Math.ceil(r_size.value/Math.sqrt(count))
    draw()
})

onMounted(() => {
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
.canvas{


    /*margin-top:250px;*/
}
</style>
