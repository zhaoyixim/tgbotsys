<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="客服"> </n-card>
    </div> 
    <n-card :bordered="false" class="mt-4 proCard">
      <n-grid cols="2 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen">
        <n-grid-item offset="0 s:0 m:1 l:1 xl:1 2xl:1">
          <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            ref="formRef"
            class="py-8"
          >
          <n-form-item-gi :span="12" label="选择客服类型" path="selectValue">
            <n-select
              v-model:value="modelform.selectValue"
              placeholder="Select"
              @change="(e)=>selectChange(e)"
              :options="generalOptions"
            />
          </n-form-item-gi>
            <n-form-item :label="showLable.label" path="name">
              <n-input v-model:value="inputValue" :placeholder="showLable.label" />
            </n-form-item>
            <n-form-item :label="showLable.label" path="images">
              <BasicUpload
                :action="uploadImagesUrl"
                :headers="uploadHeaders"
                :data="postData"
                name="files"
                :width="100"
                :height="100"
                maxNumber="1"
                @uploadChange="uploadChange"      
                @delete="deleteImages"             
                v-model:value="formValue.images"
                helpText="单个文件不超过2MB，最多只能上传10个文件"
              />
            </n-form-item>


            
            <div style="margin-left: 80px">
              <n-space>
                <n-button type="primary" @click="formSubmit">提交</n-button>
              </n-space>
            </div>
          </n-form>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, unref, reactive } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { getAppEnvConfig } from '@/utils/env';
  import {deleImg,getImgs,updateKefuImgs} from  "@/api/system/upload";
  const modelform = ref({selectValue:0})
  const kefuArr = ['微信', 'QQ', 'telegram', 'whatsapp','Lines','discord']
  let generalOptions= kefuArr.map(
        (v,index) => ({
          label: v,
          value: index
        })
      )
 
  /**select 展示b部分 */
  const showLable = ref({
    label:"微信",
    seleceIndex:0
  })
  const inputValue = ref()
  const {VITE_GLOB_API_URL} = getAppEnvConfig();
  const uploadImagesUrl = ref(VITE_GLOB_API_URL+'/api/v1/upload/multiUploadcttype3')
  let postData = {
    ctype:3,
    ctype2:0,
    ctype2Lable:""
  }
  const rules = {   
    images: {
      required: true,
      type: 'array',
      message: '请上传客服图片',
      trigger: 'change',
    },   
  };

  const selectChange = async(event:any) => {
    showLable.value.label = kefuArr[event]
    showLable.value.seleceIndex = event
    postData.ctype2  = event
    postData.ctype2Lable =  kefuArr[event]
    initData()
  }


  const formRef: any = ref(null);
  const message = useMessage();

  const ApiDataForm = reactive({data:{}})
  const formValue = reactive({
    //图片列表 通常查看和编辑使用 绝对路径 | 相对路径都可以
    images: [], 
  }); 
  let formImages = []
  const uploadHeaders = reactive({
    platform: 'miniPrograms',
    timestamp: new Date().getTime(),
    token: 'Q6fFCuhc1vkKn5JNFWaCLf6gRAc5n0LQHd08dSnG4qo=',
  });  

  const initData =async ()=>{
    let imgData = await getImgs({ctype:3,sts:1,ctype2:showLable.value.seleceIndex})
    let imagesarr = []
   
    if(imgData.length>0){
      imgData.map(res=>{        
        imagesarr.push(VITE_GLOB_API_URL+res.photo)
      })
    }
    
    if(imgData.length<=0){
      inputValue.value = ""
    }else{
      ApiDataForm.data = imgData[0]
      inputValue.value = imgData[0].account
    }
    
    formImages = imgData
    formValue.images =  imagesarr   
  }
  initData()

  async function formSubmit() {
    if(!inputValue.value){
      message.error('请输入'+showLable.value.label+"号")
      return ;
    }
    
    let sendData = {
      uploadId:ApiDataForm.data._id,
      account:inputValue.value
    }
    await updateKefuImgs(sendData)
    message.success('操作成功')
  }  
  async function deleteImages(items:any){
    if(items.image?._id){
      await deleImg({imgId:items._id});
    }else{     
      let imagesArr = formValue.images  
      delete imagesArr[items.index]
      formValue.images = imagesArr 
      await deleImg({imgId:formImages[items.index]._id});    
    }   
  } 
  function uploadChange(list: string[]) {
    //console.log(unref(list),"list")
   // formValue.images = unref(list);
  }
</script>
