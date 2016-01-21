/**
 * コード管理クラス
 * KsysCodeService.js
 * 変更が少ないコード・ラベルの組み合わせはこちらに記述
 * CodeController.jsを通じてClient側と連携する。
 */
module.exports = {
    attributes: {
        commonStatus: {
            'RESERVED': '00',
            'DELETED': '99'
        },
        //店舗の状態(businessDate)
        shopStatus: {
            'RESERVED':     {code: '00' ,label:'予約'},
            'BEFORE_OPEN':  {code: '10' ,label:'開店前'},
            'OPEN':         {code: '15' ,label:'営業中'},
            'CLOSED':       {code: '20' ,label:'営業後'},
            'FINISHED':     {code: '90' ,label:'終了'},
            'DELETED':      {code: '99' ,label:'削除'}
        },
        //キャスト(CastLady)の状態
        castStatus: {
            'RESERVED':     {code: '00' ,label:'予約'},
            'SCHEDULED':    {code: '01' ,label:'出勤予定' },
            'DAY_OFF':      {code: '02' ,label:'出勤予定なし' },
            'ON_THE_FLOOR': {code: '10' ,label:'稼働中'},
            'ON_THE_SEAT':  {code: '11' ,label:'着席中'},
            'DOUHAN':       {code: '15' ,label:'同伴中'},
            'RESTING':      {code: '30' ,label:'休憩中'},
            'AFTER':        {code: '50' ,label:'アフター'},
            'FINISHED':     {code: '90' ,label:'勤務終了'},
            'DELETED':      {code: '99' ,label:'削除'}
        },
        //来客(visitor)の状態
        visitorStatus: {
            'RESERVED':     {code: '00' ,label:'予約'},
            'WAITING':      {code: '10' ,label:'待ち'},
            'WAITING_PHONE':{code: '11' ,label:'連絡待ち'},
            'SEATED':       {code: '20' ,label:'着席'},
            'SET_START':    {code: '21' ,label:'セット中'},
            'EXTENDED':     {code: '25' ,label:'延長中'},
            'BILLING':      {code: '50' ,label:'会計中'},
            'FINISHED':     {code: '90' ,label:'完了'},
            'DELETED':      {code: '99' ,label:'削除'}
        },
        //詳細レコード(detailRecord)の状態
        detailRecordStatus: {
            'RESERVED':     {code: '00' ,label:'予約'},
            'ORDERED':      {code: '10' ,label:'注文済'},
            'CANCELED':     {code: '15' ,label:'キャンセル済'},
            'DELIVERED':    {code: '20' ,label:'配膳済'},
            'CALL_FIN':     {code: '25' ,label:'指名終了'},
            'RECEIPTED':    {code: '30' ,label:'会計中'},
            'PAID':         {code: '50' ,label:'支払済'},
            'FIXED':        {code: '70' ,label:'修正済'},
            'FINISHED':     {code: '90' ,label:'完了'},
            'DELETED':      {code: '99' ,label:'削除'}
        },
        //(MitemCategory)コード
        itemCategoryCd: {
            'RESERVED':     {code: '00' ,label:'予約'},
            'DRINK':        {code: '10' ,label:'ドリンク'},
            'FOOD':         {code: '11' ,label:'フード'},
            'SET':          {code: '20' ,label:'セット'},
            'EXTEND':       {code: '25' ,label:'延長'},
            'CALL':         {code: '30' ,label:'指名'},
            'SERVICE':      {code: '50' ,label:'サービス'},
            'PENALTY':      {code: '60' ,label:'ペナルティ'},
            'APPEND':       {code: '70' ,label:'出退勤状況'},
            'OTHER':        {code: '80' ,label:'その他'},
            'FINISHED':     {code: '90' ,label:'完了'},
            'DELETED':      {code: '99' ,label:'削除'}
        }
        
    }
};