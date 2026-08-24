// 阅读历史（未实现）。
//
// APP 端接口，抓包示例：
// https://api5-normal-sinfonlineb.fqnovel.com/reading/bookapi/read_history/list/v
//   ?book_type=0&limit=0&is_first_load=false&offset=1482
//   &last_min_read_timestamp_ms=0&full_field=false
//   + 常规设备参数（iid / device_id / aid=1967 / app_name=novelapp / version_code …）
//
// TODO: 走 appGet('/bookapi/read_history/list/v', …)，分页参数是 offset + limit，
// 返回结构待抓包核对后再补类型。

export function getHistory() {}
