<%@ WebHandler Language="C#" Class="DataService" %>

using System;
using System.Web;
using System.Web.SessionState;
using System.Collections.Generic;
using System.Xml;
using System.Data;

public class DataService : IHttpHandler, IRequiresSessionState  {

    HttpContext Context;
    HttpSessionState Session;
    HttpRequest Request;
    HttpResponse Response;
    Int16 ApplicationsId;
    Int16 UsersId;
    DBUtility Dbu;
    
    public void ProcessRequest (HttpContext con) {
        Context = con;
        Session = Context.Session;
        Request = Context.Request;
        Response = Context.Response;
        ApplicationsId = Int16.Parse(Session["ApplicationsID"].ToString());
        UsersId = Int16.Parse(Session["UsersID"].ToString());
        Dbu = new DBUtility(ApplicationsId);
        RespondToRequest(Context.Request.Form["Type"].ToString());
    }
 
    public void RespondToRequest(String Type)
    {
        switch (Type)
        {
            case "GetAllData":
                SelectData();
                break;
            case "InsertToBlog":
                InsertToBlog();
                break;
            case "UpdateBlogEntry":
                UpdateBlogEntry();
                break;
        }
    }

    public void SelectData()
    {
        String sql = @"Select Items.BlogEntries_Id, Date_Created, Creator, 
(select Username from users where users_id = Creator)As UserName,
Configuration, Date_Created
from BlogEntries_Items Items 
inner join blogentries on blogentries.blogENtries_id = Items.BLogEntries_Id
where rows_Id = " + Request.Form["Rows_Id"] + " @creator@  order by BlogEntries_Id @sort@";

        if (Request.Form["RoleBased"] != null)
        {
            sql = sql.Replace("@creator@", " AND Creator = "+ UsersId+" ");
        }
        else
        {
            sql = sql.Replace("@creator@", "");
        }
        if (String.IsNullOrEmpty(Request.Form["SortDescending"]))
            sql = sql.Replace("@sort@", "asc");
        else
            sql = sql.Replace("@sort@", "desc");
        //throw new Exception("," + Request.Form["SortDescending"]+","+ sql);
        DataTable dt = Dbu.FillDataTable(sql);
        JSONArray arr = new JSONArray();
        foreach (DataRow dRow in dt.Rows)
        {
            JSONObject obj = new JSONObject();            
            obj.AddProperty("blogEntriesId", dRow["BlogEntries_Id"]+"");
            obj.AddProperty("creator", dRow["Creator"] + "");
            obj.AddProperty("creatorName", dRow["UserName"] + "");
            obj.AddProperty("dateCreated", dRow["Date_Created"] + "");
            obj.AddProperty("dateDifference", (DateTime.Now - DateTime.Parse(dRow["Date_Created"].ToString())).TotalMinutes);
            obj.AddProperty("configuration", dRow["Configuration"]+"");
            arr.AddChild(obj);
        }
        Response.Write(arr.ToString());
        //String json = JavaScriptHelper.EscapeUri((JSONObject.DataTableToJSON(dt, true).Replace("\"", "{:dq:}").Replace("'", "{:sq:}")));
        //Response.Write(json);
    }

    public DataTable ParseDataTable(XmlNode node)
    {
        DataSet ds = new DataSet();
        DataTable dt = new DataTable();
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml("<!DOCTYPE topElementName [ <!ENTITY nbsp \"&#x00A0;\"> ]>" + "<" + node.Name + ">" + node.InnerXml + "</" + node.Name + ">");
        XmlReader xmlReader = new XmlNodeReader(xmlDoc);
        ds.ReadXml(xmlReader);
        //foreach(DataTable dtNew in ds.Tables){
        //    //Response.Write("\n-----------------"+ dtNew.TableName +"---------------------");
        //    foreach (DataRow dRow in dtNew.Rows)
        //    {
        //        foreach (DataColumn dCol in dtNew.Columns)
        //            Response.Write("\n" +dCol.ColumnName +": "+ dRow[dCol] + "\n");
        //    }
        //}
        dt = ds.Tables[0];
        return dt;
    }
    
    public void InsertToBlog()
    {
        List<String> Columns = new List<String>();
        List<String> Values = new List<String>();
        Dictionary<String, String> Images = new Dictionary<string, string>();

        String RealColumnsId = Request.Form["Columns_Id"];
        String RealRowsId= Request.Form["Rows_Id"];

        String CountSql = @"DECLARE @Count int;
DECLARE @RowsId int;
DECLARE @ColumnsId int;

SET @RowsId = @RowsId@;
SET @ColumnsId = @ColumnsId@;

select @Count = Count(*) from blogentries
where rows_id = @RowsId

update datas
set data_nvarchar = @Count+''
where columns_id = @ColumnsId
	AND rows_id = @RowsId";
        CountSql = CountSql.Replace("@RowsId@", RealRowsId).Replace("@ColumnsId@", RealColumnsId);
        
        Columns.Add("Rows_Id");
        Values.Add(Request.Form["Rows_Id"]);
        Columns.Add("Creator");
        Values.Add(UsersId+"");
        Columns.Add("Date_Created");
        Values.Add(DateTime.Now.ToString());

        String tempPath = Context.Server.MapPath("~/Blog/Uploads/Temp");
        String realPath = Context.Server.MapPath("~/Blog/Uploads/" + Session["ApplicationsID"] + "/" + Request.Form["Rows_Id"]);
        
        String xmlData = Request.Form["Data"];
        
        int blogEntriesId = Dbu.Insert("BlogEntries", Columns.ToArray(), Values.ToArray());
        XmlDocument xmlDoc = new XmlDocument();
        //throw new Exception(xmlData + "<br />" + XMLParser.Decode(xmlData));
        try
        {
            xmlData = XMLParser.Decode(xmlData);
            xmlDoc.LoadXml(xmlData);
        }
        catch (XmlException exp)
        {
            throw new Exception(exp.ToString() + "\n\n" + XMLParser.Decode(xmlData));
        }
        XmlNodeList nodeList = xmlDoc.SelectNodes("root");
        DataTable dt = ParseDataTable(nodeList[0]);
        Int16 count = 0;
        foreach (DataRow dRow in dt.Rows)
        {
            Columns = new List<String>();
            Values = new List<String>();

            Columns.Add("BlogEntries_Id");
            Values.Add(blogEntriesId + "");
            //Response.Write(dt.Columns[count++]);
            if (dt.Columns.IndexOf("content") != -1)
            {
                Columns.Add("paragraph");
                Values.Add(dRow["content"]+"");
            }            
            
            if (!String.IsNullOrEmpty(dRow["index"] + ""))
            {
                Columns.Add("[index]");
                Values.Add(dRow["index"] + "");
            }
            if (!String.IsNullOrEmpty(dRow["type"] + ""))
            {
                Columns.Add("layout_type");
                Values.Add(dRow["type"] + "");
            }
            if (dt.Columns.IndexOf("image") != -1)
            {
                if (!String.IsNullOrEmpty(dRow["image"] + ""))
                {
                    Columns.Add("image");
                    Values.Add(dRow["image"] + "");
                }
            }
            int blogItemsId = Dbu.Insert("BlogEntries_items", Columns.ToArray(), Values.ToArray());
            if (dt.Columns.IndexOf("image") != -1)
            {
                if (!String.IsNullOrEmpty(dRow["image"] + ""))
                {
                    String oldFileName = tempPath + "/" + UsersId + "_" + dRow["image"];
                    String newFileName = realPath + "/" + blogItemsId + "_" + dRow["image"];
                    Images.Add(oldFileName, newFileName);
                }
            }
            this.GenerateConfigurationForBlogItem(blogItemsId);
            count++;
        }
        if (!System.IO.Directory.Exists(realPath))
            System.IO.Directory.CreateDirectory(realPath);
        foreach (KeyValuePair<String, String> pair in Images)
        {
            System.IO.File.Move(pair.Key, pair.Value);

            String fileExtension = pair.Key.Substring(pair.Key.LastIndexOf('.'));
            if (fileExtension.ToLower().Equals(".jpg") || fileExtension.ToLower().Equals(".png") || fileExtension.ToLower().Equals(".gif"))
            {
                System.Drawing.Image image = System.Drawing.Image.FromFile(pair.Value);
                System.Drawing.Image thumbMedium = image.GetThumbnailImage(image.Width / 2, image.Height / 2, () => false, IntPtr.Zero);
                thumbMedium.Save(pair.Value.Replace(fileExtension, "_medium" + fileExtension));
                thumbMedium.Dispose();
                image.Dispose();
            }
        }
        try
        {
            Dbu.Execute(CountSql);
        }
        catch
        {
            throw new Exception(CountSql);
        }
    }


    public void UpdateBlogEntry()
    {
        List<String> Columns = new List<String>();
        List<String> Values = new List<String>();
        List<System.IO.FileInfo> filesToRemove = new List<System.IO.FileInfo>();
        Dictionary<String, String> Images = new Dictionary<string, string>();

        String tempPath = Context.Server.MapPath("~/Blog/Uploads/Temp");
        String realPath = Context.Server.MapPath("~/Blog/Uploads/" + Session["ApplicationsID"] + "/" + Request.Form["Rows_Id"]);

        String xmlData = Request.Form["Data"];

        int blogEntriesId = Int32.Parse(Request.Form["BlogEntries_Id"]);
        XmlDocument xmlDoc = new XmlDocument();
        xmlDoc.LoadXml(XMLParser.Decode(xmlData));
        XmlNodeList nodeList = xmlDoc.SelectNodes("root");
        DataTable dt = ParseDataTable(nodeList[0]);
        Int16 count = 0;
        Dbu.Delete("BlogEntries_Items", "BlogEntries_Id=" + blogEntriesId);            
        
        foreach (DataRow dRow in dt.Rows)
        {
            Columns = new List<String>();
            Values = new List<String>();

            Columns.Add("BlogEntries_Id");
            Values.Add(blogEntriesId + "");
            if (dt.Columns.IndexOf("content") != -1)
            {
                Columns.Add("paragraph");
                Values.Add(dRow["content"] + "");
            }
            if (!String.IsNullOrEmpty(dRow["index"] + ""))
            {
                Columns.Add("[index]");
                Values.Add(dRow["index"] + "");
            }
            
            if (!String.IsNullOrEmpty(dRow["type"] + ""))
            {
                Columns.Add("layout_type");
                Values.Add(dRow["type"] + "");
            }
            if (dt.Columns.IndexOf("image") != -1)
            {
                if (!String.IsNullOrEmpty(dRow["image"] + ""))
                {
                    Columns.Add("image");
                    Values.Add(dRow["image"] + "");
                }
            }
            int blogItemsId = Dbu.Insert("BlogEntries_items", Columns.ToArray(), Values.ToArray());
            if (dt.Columns.IndexOf("image") != -1)
            {
                if (!String.IsNullOrEmpty(dRow["image"] + ""))
                {
                    String oldFileName = tempPath + "/" + UsersId + "_" + dRow["image"];
                    String newFileName = realPath + "/" + blogItemsId + "_" + dRow["image"];
                    if (System.IO.File.Exists(oldFileName))
                    {
                        Images.Add(oldFileName, newFileName);
                    }
                    else
                    {
                        String oldBlogItemEntryItemId = realPath + "/" + dRow["oldBlogEntryItemId"] + "_" + dRow["image"];
                        if (System.IO.File.Exists(oldBlogItemEntryItemId))
                        {
                            Images.Add(oldBlogItemEntryItemId, newFileName);
                        }
                    }
                }
            }
            String directoryToDelete = realPath;
            System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(directoryToDelete);
            IEnumerable<System.IO.FileInfo> files = dir.EnumerateFiles(dRow["oldBlogEntryItemId"] + "_*");
            foreach (System.IO.FileInfo fileInfo in files)
            {
                filesToRemove.Add(fileInfo);
            }
            
            this.GenerateConfigurationForBlogItem(blogItemsId);
            count++;
        }
        if (!System.IO.Directory.Exists(realPath))
            System.IO.Directory.CreateDirectory(realPath);
        foreach (KeyValuePair<String, String> pair in Images)
        {
            //Response.Write(pair.Key + ":" + pair.Value + "\n");                        
            System.IO.File.Move(pair.Key, pair.Value);
            String fileExtension = pair.Key.Substring(pair.Key.LastIndexOf('.'));            
            if (fileExtension.ToLower().Equals(".jpg") || fileExtension.ToLower().Equals(".png") || fileExtension.ToLower().Equals(".gif"))
            {
                System.Drawing.Image image = System.Drawing.Image.FromFile(pair.Value);
                System.Drawing.Image thumbMedium = image.GetThumbnailImage(image.Width / 2, image.Height / 2, () => false, IntPtr.Zero);
                thumbMedium.Save(pair.Value.Replace(fileExtension, "_medium" + fileExtension));
                image.Dispose();
                thumbMedium.Dispose();
            }
        }
        foreach (System.IO.FileInfo fileInfo in filesToRemove)
        {
            fileInfo.Delete();
        }
    }

    private void GenerateConfigurationForBlogItem(int blogEntriesItemsId)
    {
        JSONObject obj = new JSONObject();
        DataRow dRow = Dbu.FillDataTable("Select * from BlogEntries_items where BlogEntries_items_Id = " + blogEntriesItemsId).Rows[0];
        obj.AddProperty("blogEntriesItemsId", dRow["BlogEntries_items_Id"]);
        
        obj.AddProperty("layoutType", dRow["Layout_Type"]);
        if (!String.IsNullOrEmpty(dRow["Image"] + ""))
            obj.AddProperty("image", dRow["Image"]);
        if (!String.IsNullOrEmpty(dRow["Paragraph"] + ""))
            obj.AddProperty("paragraph", dRow["Paragraph"]);
        obj.AddProperty("index", dRow["Index"]);
        Dbu.Execute("Update BlogEntries_items set Configuration = '" + obj.ToString() + "' where BlogEntries_items_Id = " + blogEntriesItemsId);
    }
    
    public bool IsReusable {
        get {
            return false;
        }
    }
    
}