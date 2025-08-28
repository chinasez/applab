import { useState, useEffect } from "react";
import { supabase } from "@/app/utils/supabase/client";
import { CollectionData, RecordData } from "@/app/types/editor";

export const useCollection = (projectId: string) => {
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [records, setRecords] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCollectionData();
  }, [projectId]);

  const loadCollectionData = async () => {
    try {
      setLoading(true);

      const { data: collection, error: collectionError } = await supabase
        .from("collections")
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (collectionError) throw collectionError;
      if (!collection) throw new Error("Collection not found");

      setCollection(collection);

      const { data: records, error: recordsError } = await supabase
        .from('records')
        .select('data')
        .eq('collection_id', collection.id)
        .single();

      if (recordsError) throw recordsError;

      setRecords(records?.data || null);
      
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRecords = async (newData: any) => {
    if (!collection) return false;

    try {
      const { error } = await supabase
        .from('records')
        .update({ 
          data: newData, 
          updated_at: new Date().toISOString() 
        })
        .eq('collection_id', collection.id);

      if (error) throw error;

      setRecords(newData);
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      return false;
    }
  };

  const updateCollectionFields = async (newFields: any) => {
    if (!collection) return false;

    try {
      const { error } = await supabase
        .from('collections')
        .update({ fields: newFields })
        .eq('id', collection.id);

      if (error) throw error;

      setCollection({ ...collection, fields: newFields });
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      return false;
    }
  };

  return {
    collection,
    records,
    loading,
    error,
    updateRecords,
    updateCollectionFields,
    refresh: loadCollectionData
  };
};